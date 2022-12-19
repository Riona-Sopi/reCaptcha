import { useState } from 'react';
import Footer from "../components/Footer";
import Navnav from "../components/Navnav";
import { contactFormSendEmail } from '../actions/auth';
import ReCAPTCHA from 'react-google-recaptcha'
import MainLayout from '../components/MainLayout';
import { useEffect } from "react";
import Swal from 'sweetalert2';
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";



const Ankesat = () =>{

  const [langType, setLangType] = useState(0); 
  useEffect(() => {
    const localLangType = localStorage.getItem("lang");
    if (localLangType) {
      setLangType(localLangType);
    }
  }, []);


    const [values, setValues] = useState({
        email: '',
        description:'',
        name:'',
        message: '',
        success:'',
        error: '',
        showForm: true
    });

    const { email, name, success, description, message, error, showForm } = values;

    const handleChange = name => e => {
        setValues({ ...values, message: '',  error: '', [name]: e.target.value });
    };

    const { executeRecaptcha } = useGoogleReCaptcha();
    // const handleSubmit = e => {
    //   e.preventDefault();
    //     setValues({ ...values, message: '', error: '' });
    //     contactFormSendEmail({ email, name, description }).then(data => {
    //         if (data.error) {
    //             setValues({ ...values, error: data.error });
    //         } else {
    //             setValues({ ...values, message: data.message, email: '', name:'', description:'', showForm: true,});
    //             Swal.fire({
    //               title:  data.message,
    //               showClass: {
    //                 popup: 'animate__animated animate__fadeInDown'
    //               },
    //               hideClass: {
    //                 popup: 'animate__animated animate__fadeOutUp'
    //               }
    //             })
    //         }
    //     });
    // };
    const handleSubmit = e => {
      e.preventDefault();
      if (!executeRecaptcha) {
          console.log("Execute recaptcha not yet available");
          return;
      }
      executeRecaptcha("complaint").then((gReCaptchaToken) => {
          console.log(gReCaptchaToken, "response Google reCaptcha server");
          submitComplainForm(gReCaptchaToken);
      });

      const submitComplainForm = (gReCaptchaToken) => {
          fetch("/api/recaptcha", {
              method: "POST",
              headers: {
              Accept: "application/json, text/plain, */*", "Content-Type": "application/json",},
              body: JSON.stringify({
                  name: name,
                  email: email,
                  message: message,
                  gRecaptchaToken: gReCaptchaToken,
              }),}).then((res) => res.json()).then((res) => {
                  console.log(res, "response from backend");
                  if (res?.status === "success") {
                      // Human so submit the complain form
                      setValues({...values, message: '', error: ''});
                      contactFormSendEmail({email, name, description}).then(data => {
                          if (data.error) {
                              setValues({...values, error: data.error});
                          } else {
                              setValues({...values, message: data.message, email: '', name: '', description: '', showForm: true,});
                              Swal.fire({
                                  title: data.message,
                                  showClass: {
                                      popup: 'animate__animated animate__fadeInDown'
                                  },
                                  hideClass: {
                                      popup: 'animate__animated animate__fadeOutUp'
                                  }
                              })
                          }
                      });
                  } else {
                    Swal.fire({
                      title: "Robot",
                      showClass: {
                          popup: 'animate__animated animate__fadeInDown'
                      },
                      hideClass: {
                          popup: 'animate__animated animate__fadeOutUp'
                      }
                  })
                      {/*Action to do if not a human*/}
                  }
              });
      };
  }

    const showError = () => (error ? <div className="alert alert-danger alert-dismissible fade show" role="alert">{error} 
    <button type="button" class="btn-close" data-dismiss="alert" aria-label="Close"></button></div> : '');


    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );


    const ankesatForm = () => (
        <>
            <p className="headerTitle">{langType == 0 ? "ANKESA" : "COMPLAINTS"}</p>
            <div className="complainForm">
                <form className="" onSubmit={handleSubmit} data-toggle="modal" data-target="#exampleModalCenter">
                    <label htmlFor="" className="lab1">{langType == 0 ? "Emri*" : "Name*"}</label>
                    <input type="text" id="namee" placeholder={langType == 0 ? "Shkruani emrin tuaj" : "Write your name"}
                    required 
                    value={name}
                    onChange={handleChange('name')}/>

                    {/* <label htmlFor=""  className="lab2">Mbiemri*</label>
                    <input type="text" id="mbiemrii" placeholder="Shkruani mbiemrin tuaj" required/> <br /> */}
                 
                    <label htmlFor=""  className="lab3">{langType == 0 ? "Email Adresa*" : "Email*"}</label>
                    <input type="email" id="emaill" placeholder={langType == 0 ? "Shkruani email adresën tuaj" : "Write you email"}
                    required 
                    value={email}
                    onChange={handleChange('email')}/>
                    
                    <label htmlFor="" className="lab4">{langType == 0 ? "Ankesa*" : "Complaint*"}</label>
                    <input type="text" id="ankesa" placeholder={langType == 0 ? "Shkruani kërkesën tuaj" : "Write your complaint"}
                    required 
                    value={description}
                    onChange={handleChange('description')}/>
                    {/* <input type="text" name="Ankesa" id="ankesa" placeholder="Shkruani kërkesën tuaj" required /> */}
                     <br />
                    <div className="text-right">
                        <button type="submit" className="sendbtn">{langType == 0 ? "DËRGO" : "SEND"}</button>
                    </div>
                </form>
          </div>
        </>
    );

    return (
        <MainLayout setLangType={setLangType} langType={langType}>
        <div>
        {showForm && ankesatForm()}
        {showError()}
        {/* {showSuccess()} */}
        {/* {showMessage()} */}
        </div>
         <div className='globalSpace'>
        </div>
        </MainLayout>
    );

    
};

export default function ComplainPage(){
    return (
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_WEBSITE_KEY} scriptProps={{
              async: false,
              defer: false,
              appendTo: "head",
              nonce: undefined,}}>
        <Ankesat />
      </GoogleReCaptchaProvider>
    );
  }

