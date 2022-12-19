import Navnav from "../components/Navnav";
import Footer from "../components/Footer";
import NewsletterSubscribe from "../components/NewsLetterSubscribe";
import JobOpeningsSubscribe from "../components/JobOpeningsSubscribe";
import { careerFormSendEmail } from '../actions/auth';
import { useState, useEffect, useRef } from 'react';
import { API, TRY } from '../config';
import { Parser } from 'html-to-react';
import MainLayout from "../components/MainLayout";
import Swal from 'sweetalert2';
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";


export default function KonkursPune({router, careers, openings}){

  const [langType, setLangType] = useState(0);
  useEffect(() => {
    const localLangType = localStorage.getItem("lang");
    if (localLangType) {
      setLangType(localLangType);
    }
  }, []);




  const [values, setValues] = useState({
      email: '',
      lastName:'',
      birthday:'',
      formData: '',
      position:'',
      phone:'',
      name:'',
      message: '',
      success:'',
      error: '',
  });

  const { email, formData, lastName, name, birthday, position, phone, success, message, error} = values;


      useEffect(() => {
        setValues({ ...values, formData: new FormData()});
      }, [router]);


      const { executeRecaptcha } = useGoogleReCaptcha();
      const handleSubmit = e => {
        e.preventDefault();
        if (!executeRecaptcha) {
            console.log("Execute recaptcha not yet available");
            return;
        }
        executeRecaptcha("job_openings").then((gReCaptchaToken) => {
            console.log(gReCaptchaToken, "response Google reCaptcha server");
            submitJobOpeningsForm(gReCaptchaToken);
        });

        const submitJobOpeningsForm = (gReCaptchaToken) => {
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
                        // Human so submit the application
                        careerFormSendEmail(formData).then(data => {
                            if (data.error) {
                                setValues({ ...values, error: data.error });
                                Swal.fire({
                                    title: data.error,
                                    showClass: {
                                        popup: 'animate__animated animate__fadeInDown'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animate__fadeOutUp'
                                    }
                                })
                            } else {
                                setValues({ ...values,  email: '', name:'', birthday:'', lastName:'', position:'', phone:'', error: '', message: data.message});
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
                        {/*Action to do if not a human*/}
                    }
                });
        }
      };


    const handleChange = name => e => {
        const value = name === 'cv' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    const handleChange1 = name => e => {
      const value = name === 'image' ? e.target.files[0] : e.target.value;
      formData.set(name, value);
      setValues({ ...values, [name]: value, formData, error: '' });
  };



    const showError = () => (error ? <div className="alert alert-danger alert-dismissible fade show" role="alert">{error} 
    <button type="button" class="btn-close" data-dismiss="alert" aria-label="Close"></button></div> : '');



    const showCareers = () => {
      return careers.map((career, i) => {
          return (
            <>
          <p className="jobtitlepage">{langType == 0 ? "KONKURS PUNE" : "JOB OPENINGS"}</p>
             <div className="jobofferSpace">
                <div className="joboffer">
                  <p className="joboffertitle">{langType == 0 ? career.careerTitle : career.careerTitle_en}</p>
                  <p className="jobofferdesc">
                     {Parser().parse(langType == 0 ? career.careerDescription : career.careerDescription_en)} 
                  </p>
                </div>

                  <div className="openjobsp">
                    <p>POZITAT E HAPURA (KLIKO KËTU PËR TA SHKARKUAR APLIKACIONIN){langType == 0 ? "POZITAT E HAPURA" : "JOB OPENINGS"}</p>
                    <ul>
                      {openings.map((opening, i) => (     
                       <li key={i}>{langType == 0 ? opening.name : opening.name_en}</li>
                      ))}
                    </ul>
                  </div>

                   <div>
                      <form onSubmit={handleSubmit} className="jobofferForm">
                         <input type="text" id="name" placeholder={langType == 0 ? "Emri" : "Name"}
                          required 
                          value={name}
                          onChange={handleChange('name')}/><br/>
                          <input type="text" id="surname" placeholder={langType == 0 ? "Mbiemri" : "Last Name"}
                          required 
                          value={lastName}
                          onChange={handleChange('lastName')}/><br/>
                          <input type="text" id="date" placeholder={langType == 0 ? "Data e Lindjes" : "Birthday"}
                          required 
                           value={birthday}
                           onChange={handleChange('birthday')}
                           onFocus={(e) => (e.target.type = "date")}
                      
                            /><br/>
            
                          <div>
                          
                            <select id="selectopt"
                                value={position} 
                                onChange={handleChange('position')}
                                type="text"
                                placeholder="Select Position">
                                  <option value="" disabled selected>{langType == 0 ? "Zgjedh Pozicionin" : "Select Position"}</option>
                                {openings.map((opening, i) => ( 
                                <option key={i}>{langType == 0 ? opening.name : opening.name_en}</option>
                                ))}
                            </select>
                          </div>
                        {/* </div> */}
                          <input type="email" id="email" placeholder={langType == 0 ? "Email Adresa" : "Email"}
                          required 
                          value={email}
                          onChange={handleChange('email')}/><br />

                          <input type="tel" id="phone" placeholder={langType == 0 ? "Numri i Telefonit" : "Phone Number"}
                          required 
                          value={phone}
                          onChange={handleChange('phone')}/><br />
                  
  

                        <p className="upload">{langType == 0 ? "Shkarko CV" : "Upload CV"}</p>
                        <input required id="cv" name="cv" onChange={handleChange('cv')} type="file" onClick={e => (e.target.value = null)} accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation"/>

                        <p className="upload">{langType == 0 ? "Shkarko Foto" : "Upload Image"}</p>
                        <input required id="img" name="image" onChange={handleChange1('image')} type="file" onClick={e => (e.target.value = null)} accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/>


                        <div className="applybtn">
                         <button type="submit" className="apply" data-toggle="modal" data-target="#exampleModalCenter">{langType == 0 ? "APLIKO" : "APPLY"}</button>
                       </div>
                   
                      </form>
                   </div>
             </div>
    
          </>
          );
       });
   };



    return(

      <MainLayout setLangType={setLangType} langType={langType}>
        <div>
        
        {showCareers()}
        
        <JobOpeningsSubscribe setLangType={setLangType} langType={langType}/>
        </div>
      </MainLayout>

    )
}


// export default function KonkursPune(){
//   return (
//     <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_WEBSITE_KEY} scriptProps={{
//             async: false,
//             defer: false,
//             appendTo: "head",
//             nonce: undefined,}}>
//       <KonkursPune />
//     </GoogleReCaptchaProvider>
//   );
// }


export async function getServerSideProps(){
  const [careersRes, openingsRes] = await Promise.all([
      fetch(`${API}/career`),
      fetch(`${API}/openings`),
    ]);
    const [careers, openings] = await Promise.all([
      careersRes.json(), 
      openingsRes.json()
    ]);
    return { props: {careers, openings} }; 
};

