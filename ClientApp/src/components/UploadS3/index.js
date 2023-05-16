import React, { useRef, useState } from "react";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import Bucket from "../../aws";
import short from "short-uuid";
import awsService from "services/aws.service";
const UploadToS3WithNativeSdk = ({ setImage, setLoad, setFileName, fileType, title }) => {
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState("");
  const fileInput = useRef();

  const handleFileInput = (e) => {
    setErrors("");
    var fileSize = e.target.files[0].size / 1024 / 1024;
    if (fileSize > 10) {
      setErrors("File size must be less than 10 MB");
    } else if (!e.target.files[0].type.match("image.*") && fileType === "image") {
      setErrors("Please choose a valid image file");
    } else {
      uploadFile(e.target.files[0]);
      e.target.value = null;
    }
  };

  const uploadFile = (file) => {
    let key = `${short.generate()}-${file.name.replace("-", "_")}`;
    setLoad(true);
    // console.log(key,file,"key generate")
    let formData = new FormData();
    formData.append("fileName", key);
    formData.append("file", file);
    awsService
      .UploadFileToAWS(formData)
      .then((r) => {
        setFileName(key);
        fileType === "image" && setImage(URL.createObjectURL(file))
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err, "error in updload file");
      });
    
    //  setTimeout(()=>{
    //     Bucket.promisesOfS3Objects(key)
    //     .then((data) => {
    //       console.log(data,"image data response from bucket and backend")
    //     //   setUserImg(data);
    //     setFileName(key);
    //                 fileType === "image" && setImage(URL.createObjectURL(file))
    //                 setLoad(false);
    //     })
    //     .catch(function (err) {
    //       console.log(err)
    //     })
    //  },2000)

    // const params = {
    //     ACL: 'private',
    //     Body: file,
    //     Bucket: Bucket.S3_BUCKET,
    //     Key: key
    // };
    // setLoad(true);
    // Bucket.myBucket.putObject(params)
    //     .on('httpUploadProgress', (evt) => {
    //         // console.log(evt)
    //         setProgress(Math.round((evt.loaded / evt.total) * 100))
    //     })
    //     .send((err, data) => {
    //         if (err) {
    //             console.log(err);
    //             setLoad(false)
    //         }
    //         else {
    //             setFileName(key);
    //             fileType === "image" && setImage(URL.createObjectURL(file))
    //             setLoad(false);
    //         }
    //     })
  };

  return (
    <>
      <MKButton variant="gradient" color="info" onClick={() => fileInput.current.click()}>
        {title}
      </MKButton>
      <input ref={fileInput} type="file" style={{ display: "none" }} onChange={handleFileInput} />
      {errors !== "" ? (
        <MKTypography fontSize="0.75rem" color="error" style={{ display: "block" }} textGradient>
          {errors}
        </MKTypography>
      ) : null}
      {/* <input type="file" onChange={handleFileInput}/> */}
    </>
  );
};

export default UploadToS3WithNativeSdk;
