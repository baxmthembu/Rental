import React, { useContext, useState } from "react";
import Axios from "axios";
import Validate from "../Validate/workervalidate";
import { WorkerContext } from "../WorkerContext";
import { useNavigate } from "react-router-dom";

const logo = require('../Images/logo.png')
const image = require('../Images/coconut ..png')


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {setWorker} = useContext(WorkerContext)
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    })
    const navigate = useNavigate()


    const ProceedLogin = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        const validationResponse = Validate(formData);
        try{
            if(validationResponse.isValid){
                const response = await Axios.post('http://localhost:3001/login', formData)

                if(response.status === 200){
                    const workerId = response.data.user.id;
                    localStorage.setItem('workerId', workerId)
                    setWorker({id: workerId, role:'owner'})
                    navigate('/searchbar')
                }else{
                    console.error('Authentification failure')
                }
            }
        }catch(err){
            console.log('error ' + err)
        }finally{
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    return(
        <>
        <div>
            <div className='register-container'>
            <div className="register-form">
                <form onSubmit={ProceedLogin} className="form">
                    <div className="register-logo">
                        <img src={image} className='register-logo' style={{top:'-4em', width:'600px', left:'40%'}} />
                    </div>
                    <h1 className="header">Sign in</h1>
                    <div className="form-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                        <input value={formData.name} onChange={handleChange} type="text" name="name" placeholder="Enter name" />
                    </div>
                    <div className="form-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
                        <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter password" />
                    </div>
                    <div className="form-container">
                        <p><input type="checkbox" className="icon" style={{cursor: 'pointer'}}/>I agree all statements in <a href="/home" style={{textDecoration:'none',color:'blue'}}>Terms of service</a></p>
                    </div>
                    <div className="button">
                        <button type="submit" className="submit">Submit</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </>
    )


}

export default Login