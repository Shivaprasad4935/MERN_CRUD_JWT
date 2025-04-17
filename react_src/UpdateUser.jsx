import React from "react";
import { useParams,useNavigate} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";

const UpdateUser = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [age, setage] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`http://localhost:3001/getuser/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                setname(res.data.name);
                setemail(res.data.email);
                setage(res.data.age);
            })
            .catch(err => {
                console.log(err);
            });
    }, [id, token]);

    const update = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/updateuser/${id}`, { name, email, age }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                console.log(res);
                navigate('/');
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center bg-primary">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={update}>
                    <h2>Update User</h2>
                    <div className="mb-2">
                        <label htmlFor="">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Age</label>
                        <input
                            type="text"
                            placeholder="Enter Age"
                            className="form-control"
                            value={age}
                            onChange={(e) => setage(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success">Update</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateUser;