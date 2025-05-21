import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLookup } from "../../context/LookUpContext"
function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({username:"",
        password:"",
    })
    const [error,setError] = useState(false)
    const handleUserChange = event => {
        setFormData(pre => {
            return {...pre,username:event.target.value}
        })
    }

    const handlePassChange = event => {
        setFormData(pre => {
            return {...pre,password:event.target.value}
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
          const response = await fetch('http://localhost:8000/user-api/beneficiary/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          console.log(result)
          localStorage.setItem('access_token', result.token);
          localStorage.setItem('user_id', result.user_id);
          localStorage.setItem('username', result.username);
          // Handle success
          setError(false)
          navigate('/home')

        } catch (err) {
          setError(true)
        }
      };
    return <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleUserChange}/><br/>
        <input type="password" onChange={handlePassChange}/><br/>
        <input type="submit" value="submit" />
        {error?<h1>error</h1>:null}
    </form>
}

export default Login