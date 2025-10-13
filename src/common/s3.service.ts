import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
	private readonly s3: S3Client;
	private readonly bucket: string;

	constructor() {
		this.s3 = new S3Client({
			region: process.env.AWS_REGION,
			credentials: process.env.AWS_ACCESS_KEY_ID
				? {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
				}
			: undefined,
		});
		this.bucket = process.env.AWS_S3_BUCKET as string;
	}

	async uploadObject(params: { key: string; body: Uint8Array | Buffer | string; contentType?: string }): Promise<string> {
		await this.s3.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: params.key,
				Body: params.body,
				ContentType: params.contentType,
			}),
		);
		return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.key}`;
	}
}


