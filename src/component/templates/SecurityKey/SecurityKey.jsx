"use client";
import React, { useState } from "react";
import LayoutWrapper from "@/component/atoms/LayoutWrapper";
import { Col, Container, Row } from "react-bootstrap";
import TopHeader from "@/component/atoms/TopHeader";
import Image from "next/image";
import { Input } from "@/component/atoms/Input";
import { TextArea } from "@/component/atoms/TextArea/TextArea";
import Button from "@/component/atoms/Button";
import classes from "./SecurityKey.module.css";
import { MdOutlineSecurity } from "react-icons/md";
import { TbLockAccess } from "react-icons/tb";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Post } from "@/interceptor/axiosInterceptor";
import { capitalizeFirstLetter } from "@/resources/utils/helper";
import moment from "moment-timezone";

export default function SecurityKey({slug}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState("");
  const PatientDataFormik = useFormik({
    initialValues: {
      patientId: "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading("loading");
    const obj = {
      patientId:slug,
      password:values?.password
    }
    const response = await Post({ route: "users/patient/login", data: obj });
    console.log("response", response?.response?.data?.data?.user);
    setLoading("");
    if (response) {
      setData(response?.response?.data?.data?.user);
    }
  };


  return (
    <LayoutWrapper>
      <Container>
        {data ? (
          <div>
            <TopHeader data="Patient Details" />
            <Row>
              <Col md={6}>

              <Input type={"text"} label={"Donor"} disabled={true} value={"Yes"} />
              </Col>
              <Col md={6}>
              <Input type={"text"} label={"Blood Type"} disabled={true} value={data?.bloodType} />
              </Col>
              <Col md={6}>
              <Input type={"text"} disabled={true} label={"Gender"} value={capitalizeFirstLetter(data?.gender)} />
              </Col>
              <Col md={6}>
              <Input type={"text"} disabled={true} label={"Date of birth"} value={moment(data?.dateOfBirth).format('YYYY/MM/DD')} />
              </Col>
              <Col md={6}>
              <Input type={"text"} label={"Doctor's full name"} disabled={true} value={`${data?.firstName} ${data?.lastName}`} />
              </Col>
              <Col md={6}>
              <Input type={"email"} label={"Patients Email address"} disabled={true} value={`${data?.email}`} />
              </Col>
              <Col md={6}>
              <Input type={"number"} label={"Emergency Contact"} disabled={true} value={Number(data?.phoneNumber)} />
              </Col>
           
            </Row>
          </div>
        ) : (
          <>
            <TopHeader data={"security-key"} />
            <div className={classes.contactUsCard}>
              <Col md={6}>
                <div className={classes.headingDiv}>
                  <h2>View Documents With Your Security Key</h2>
                  <p>To view your documents, just fill the form!</p>
                </div>
                <div className={classes.contactUsDetails}>
                  <div className={classes.contactInfoDiv}>
                    <div className={classes.imageDiv}>
                      <MdOutlineSecurity
                        size={32}
                        className={classes.iconColor}
                      />
                    </div>
                    <p>Secured data</p>
                  </div>
                  <div className={classes.contactInfoDiv}>
                    <div className={classes.imageDiv}>
                      <TbLockAccess size={32} className={classes.iconColor} />
                    </div>
                    <p>Access with you security key</p>
                  </div>
                </div>
              </Col>
              <Col md={6} className={classes.contactUsFormDiv}>
                <div className={classes.inputDivs}>
                  <Input
                    placeholder={"Password"}
                    type={"password"}
                    mainContClassName={"mb-0"}
                    setter={(e) => {
                      PatientDataFormik.setFieldValue("password", e);
                    }}
                    value={PatientDataFormik.values.password}
                    onBlur={PatientDataFormik.handleBlur}
                    errorText={
                      PatientDataFormik.touched.password &&
                      PatientDataFormik.errors.password
                    }
                  />
                </div>
                <div className={classes.button}>
                  <Button
                    onClick={() => {
                      PatientDataFormik.handleSubmit();
                    }}
                    disabled={loading === "loading"}
                    label={loading === "loading" ? "loading...." : "Submit"}
                    variant={"gradient"}
                  />
                </div>
              </Col>
            </div>
          </>
        )}
      </Container>
    </LayoutWrapper>
  );
}


