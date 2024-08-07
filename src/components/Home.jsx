import {
  ArrowUpIcon,
  ChatIcon,
  DeleteIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  Link,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import "react-medium-image-zoom/dist/styles.css";
import { datadogRum } from '@datadog/browser-rum';

import { useMediaQuery } from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";

import axios from "axios";
import React from "react";

import { useEnvContext } from "./Context";

const api_base_url = import.meta.env.VITE_API_URL;

// Change
class ValidationError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = `ERROR on - "${message}" `;

    // Create an instance of the error
    const error = new Error(message);

    // Adding the error instance to Datadog RUM
    datadogRum.addError(error, {
      message: this.name,
      stack: error.stack,
      source: "Home.jsx",
      type: "Error"
    });
  }
}

const onUnhandledError = async (message) => {
  try {
    throw new Error(message);
  } catch {
    console.log(`Error: ${message}`);
  }
};

export default function Home() {
  const [activeBackend, setActiveBackend] = useEnvContext();
  const [allImages, setAllImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
  const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");
  const fileUploadRef = useRef(null);
  const errorTextRef = useRef(null);
  const toast = useToast();

  const cols = isLargerThan1200 ? 4 : 1;

  // function to convert string to mixed case
  const toMixedCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getImages = async () => {
    const res = await axios({
      method: "get",
      // mode: "cors",
      withCredentials: false,
      url: `${api_base_url}/images`,
      params: { backend: activeBackend },
    });
    const data = await res.data;
    return data;
  };

  const postImage = async (url, formdata) => {
    const res = await axios({
      method: "post",
      url: url,
      data: formdata,
      params: { backend: activeBackend },
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  };

  const delImage = async (id) => {
    const res = await axios({
      method: "delete",
      params: { backend: activeBackend },
      url: `${api_base_url}/delete_image/${id}`,
    });
    return res;
  };

  // Function to calculate upload progress, but Axios lacks fidelity to do this properly
  // const onUploadProgress = (e) => {
  //   const percentage = Math.round((100 * e.loaded) / e.total);
  //   setUploadProgress(percentage);
  //   console.log(`Upload % = ${percentage}`);
  // };

  const onInputChange = (e) => {
    setIsSelected(true);
    setSelectedFile(e.target.files[0]);
  };

  const onErrorGen = async (e) => {
    for (let i = 0; i < 100; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        toast({
          title: "Error Sent",
          description: `Trapping your ERROR - ${i}`,
          position: "top",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
        throw new ValidationError(`${errorTextRef.current.value} - ${i}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }
  };

  const onFileUpload = async (e) => {
    if (fileUploadRef.current.value == "") {
      toast({
        title: `Select an Image`,
        description: `Please select an image to upload`,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("file", selectedFile, selectedFile.name);
      const res = await postImage(`${api_base_url}/add_image`, formdata);
      if (res.data?.message.includes("questionable")) {
        toast({
          title: `Questionable Content`,
          description: `${res.data.message}`,
          position: "top",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } else {
        setIsUploadSuccessful(!isUploadSuccessful);
        console.log(`Amazon Response: ${JSON.stringify(res)}`);
        console.log(`File Uploaded: ${isUploadSuccessful}`);
      }
    }
    setIsLoading(false);
  };

  const onFileDelete = async (image) => {
    const id = image.id || image._id?.$oid; // Mongo or Postgres
    console.log(`Delete: {db: ${activeBackend}, id: ${id}`);
    const res = await delImage(id);
    if (res.status == "201") {
      setIsDeleteSuccessful(!isDeleteSuccessful);
      console.log(res);
      toast({
        title: `Delete Picture`,
        description: `We deleted ${image.name} from ${toMixedCase(
          activeBackend
        )}`,
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSendError = async (image) => {
    // Add an attachment
    const name =
      image.name.substring(0, image.name.lastIndexOf(".")) || image.name;
    await image.ai_labels.map((label, index) => {
    });
    toast({
      title: "Error Sent",
      description: `We sent your ERROR on - ${image.name}`,
      position: "top",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    // throw new ValidationError(image.name);
    throw new ValidationError(image.name);
  };


  // Refresh after Upload or Delete
  useEffect(() => {
    const images = getImages().then((res) => {
      setAllImages(res);
      localStorage.setItem("activeBackend", activeBackend);
      fileUploadRef.current.value = null;
    });
  }, [isUploadSuccessful, isDeleteSuccessful, activeBackend]);

  return (
    <Center>
      <VStack spacing={2}>
        <Image htmlWidth="400px" objectFit="contain" src={"/qs.png"}></Image>
        <Heading textAlign="center" color="purple.300" as="h2">
          I'm a Smart'ish{" "}
          <Link color="purple.400" href="https://datadoghq.com" isExternal>
            Gallery
          </Link>{" "}
        </Heading>
        <Heading textAlign={"center"} color="blue.300" size={"md"}>
          {" "}
          Note: Uploading a picture identified as a "bug" will generate a
          Backend Error
        </Heading>
        <br></br>
        <Center>
          <InputGroup>
            <VStack spacing={5}>
              <Input
                color="purple.300"
                ref={fileUploadRef}
                type="file"
                onChange={onInputChange}
                size="lg"
                maxWidth={400}
              />

              <Button
                bg="yellow.500"
                rightIcon={<ArrowUpIcon />}
                iconSpacing={2}
                padding={5}
                size="lg"
                onClick={onFileUpload}
                isLoading={isLoading}
                loadingText="Upload"
                className="upload_button"
              >
                Upload Photo
              </Button>
            </VStack>
          </InputGroup>
        </Center>
        <RadioGroup
          defaultValue="mongo"
          padding={5}
          onChange={setActiveBackend}
          value={activeBackend}
        >
          <Stack spacing={5} direction="row">
            <Radio colorScheme="green" value="mongo">
              Mongo
            </Radio>
            <Radio colorScheme="orange" value="postgres">
              Postgres
            </Radio>
          </Stack>
        </RadioGroup>
        {/* <InputGroup size="lg">
          <InputLeftAddon children="Error Text"></InputLeftAddon>
          <Input
            placeholder="Generated Error"
            ref={errorTextRef}
            size="lg"
            maxWidth={275}
          />
          <Button
            bg="red.500"
            rightIcon={<ArrowUpIcon />}
            onClick={onErrorGenerator}
            loadingText="Generate 100 Random Errors"
            className="error_gen_button"
          >
            Generate 100 Errors
          </Button>
        </InputGroup> */}

        <br></br>
        <SimpleGrid columns={cols} spacing={8}>
          {allImages.map((image) => {
            return (
              <div className="image_container">
                <Text
                  key={image.id}
                  color="purple.500"
                  width={300}
                  noOfLines={1}
                >
                  {image.name}
                </Text>
                <div className="button_container">
                  <IconButton
                    key={`error_button-${image.id}`}
                    bg="gray.800"
                    color="yellow.300"
                    className="error_button"
                    colorScheme="yellow"
                    aria-label="Throw Error"
                    size="md"
                    onClick={() => onSendError(image)}
                    icon={<WarningIcon />}
                  ></IconButton>
                  <IconButton
                    key={`feedback_button-${image.id}`}
                    bg="gray.800"
                    color="yellow.300"
                    className="feedback_button"
                    colorScheme="orange"
                    aria-label="Send Feedback"
                    size="md"
                    onClick={() => onUnhandledError("User Feedback Error")}
                    icon={<ChatIcon />}
                  ></IconButton>
                  <IconButton
                    key={`delete_button-${image.id}`}
                    bg="gray.800"
                    color="red.500"
                    className="delete_button"
                    colorScheme="red"
                    aria-label="Delete Image"
                    size="md"
                    onClick={() => onFileDelete(image)}
                    icon={<DeleteIcon />}
                  ></IconButton>
                </div>
                <Image
                  key={`image-${image.id}`}
                  borderRadius={15}
                  boxSize="300px"
                  src={image.url}
                  objectFit="cover"
                ></Image>
                <Text
                  key={`label-${image.id}`}
                  className="label_container"
                  width={300}
                >
                  {" "}
                  <span className="ai_text">
                    {" "}
                    Text Detected:{" "}
                    {image.ai_text?.length > 0
                      ? image.ai_text.slice(0, 10).join(",  ")
                      : "No Text Detected"}{" "}
                  </span>
                  <br></br>
                  <span className="ai_label">
                    Tags:{" "}
                    {image.ai_labels?.length > 0
                      ? image.ai_labels?.slice(0, 10).join(",  ")
                      : "No Labels Detected"}{" "}
                  </span>
                </Text>
                {/* {image.ai_labels.map((label) => {
                      return <Text className="image_ai_labels">{label}</Text>;
                    })} */}
              </div>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Center>
  );
}
