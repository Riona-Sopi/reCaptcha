import Navnav from "../components/Navnav";
import Footer from "../components/Footer";
import NewsletterSubscribe from "../components/NewsLetterSubscribe";
import JobOpeningsSubscribe from "../components/JobOpeningsSubscribe";
import { careerFormSendEmail } from '../actions/auth';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { API, TRY } from '../config';
import { Parser } from 'html-to-react';
import MainLayout from "../components/MainLayout";
import Swal from 'sweetalert2';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

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


      const handleSubmit = e => {
        e.preventDefault();
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
          return (
            <>
          <p className="jobtitlepage">{langType == 0 ? "KONKURS PUNE" : "JOB OPENINGS"}</p>
             <div className="jobofferSpace">
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
                                  <option value="" disabled selected hidden>Zgjedh poziten</option>
                                    <option value="Option 1">1</option>
                                    <option value="Option 2">2</option>
                                    <option value="Option 3">3</option>
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




