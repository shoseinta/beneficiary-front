import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
      const fetchTypeLayerOne = async () => {
        try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/requests/type-layer1/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          localStorage.setItem('type-layer1',result)
        } catch (err) {
          console.log(err)
        }
      }

      const fetchTypeLayerTwo = async () => {
        try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/requests/type-layer2/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          localStorage.setItem('type-layer2',result)
        } catch (err) {
          console.log(err)
        }
      }
      const fetchProcessingStage = async () => {
        try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/requests/processing-stage/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          localStorage.setItem('processing-stage',result)
        } catch (err) {
          console.log(err)
        }
      }
      const fetchDuration = async () => {
        try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/requests/duration/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          localStorage.setItem('duration',result)
        } catch (err) {
          console.log(err)
        }
      }
      const fetchProvince = async () => {
        try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/provinces/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          localStorage.setItem('provinces',result)
        } catch (err) {
          console.log(err)
        }
      }
      const fetchCity = async () => {
        try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/cities/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          localStorage.setItem('cities',result)
        } catch (err) {
          console.log(err)
        }
      }
      
      useEffect(() => {
        fetchTypeLayerOne();
        fetchTypeLayerTwo();
        fetchProcessingStage();
        fetchDuration();
        fetchProvince();
        fetchCity();
      },[])
    return <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleUserChange}/><br/>
        <input type="password" onChange={handlePassChange}/><br/>
        <input type="submit" value="submit" />
        {error?<h1>error</h1>:null}
    </form>
}

export default Login