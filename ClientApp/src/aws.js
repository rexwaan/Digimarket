import AWS from 'aws-sdk'

const S3_BUCKET = 'digimarket-s3';
const REGION = 'us-east-1';


AWS.config.update({
    accessKeyId: 'fKpOOj14FffdhOZU1AVt2kiMN34lq3lDGSGtC88y',
    secretAccessKey: 'AKIAWCZBWY3DJ6AEV4PY'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
})

var promisesOfS3Objects = async (key) => {

    return myBucket.getObject({
        Bucket: S3_BUCKET,
        Key: key
    }).promise()
        .then(function (file) {
            return URL.createObjectURL(new Blob([file.Body], { type: "image/jpg" }));
        })

}
var presignedUrl = (key) => {
    var params = { Bucket: S3_BUCKET, Key: key, Expires: 200000 };
    return myBucket.getSignedUrl('getObject', params);
}

export default {
    S3_BUCKET,
    myBucket,
    promisesOfS3Objects,
    presignedUrl
};