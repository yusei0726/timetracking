package screenshot

import (
	"bytes"
	"fmt"
	"image/png"
	"time"
)

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/kbinani/screenshot"
)

type ScreenshotTaker struct{}

func NewScreenshotTaker() *ScreenshotTaker {
	return &ScreenshotTaker{}
}

func (st *ScreenshotTaker) CaptureAndUpload() {
	const awsRegion = "ap-northeast-1"

	// AWS セッションを作成（環境変数から認証情報を読み込む）
	sess, _ := session.NewSession(&aws.Config{
		Region:      aws.String(awsRegion),
		Credentials: credentials.NewEnvCredentials(), // 環境変数から認証情報を読み込む
	})

	// S3 サービスクライアントを作成
	svc := s3.New(sess)

	// 10分ごとにタスクを実行するTickerを作成
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// ここでスクリーンショットを撮影してS3にアップロード
			st.uploadScreenshots(svc)
		}
	}
}

func (st *ScreenshotTaker) uploadScreenshots(svc *s3.S3) {
	const S3Bucket = "yusei-surveillance"

	n := screenshot.NumActiveDisplays()
	for i := 0; i < n; i++ {
		bounds := screenshot.GetDisplayBounds(i)
		img, err := screenshot.CaptureRect(bounds)
		if err != nil {
			fmt.Printf("Failed to capture screenshot: %v\n", err)
			continue
		}

		now := time.Now()
		dateTimeStr := now.Format("20060102150405")
		fileName := fmt.Sprintf("%s_%d_%dx%d.png", dateTimeStr, i, bounds.Dx(), bounds.Dy())

		buf := new(bytes.Buffer)
		err = png.Encode(buf, img)
		if err != nil {
			fmt.Printf("Failed to encode screenshot: %v\n", err)
			continue
		}

		_, err = svc.PutObject(&s3.PutObjectInput{
			Bucket:      aws.String(S3Bucket),
			Key:         aws.String(fileName),
			Body:        bytes.NewReader(buf.Bytes()),
			ContentType: aws.String("image/png"),
		})

		if err != nil {
			fmt.Printf("Failed to upload to S3: %v\n", err)
			continue
		}

		fmt.Printf("Uploaded screen #%d: %s\n", i, fileName)
	}
}
