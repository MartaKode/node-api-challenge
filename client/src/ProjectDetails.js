import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ProjectDetails = () => {
    const [projectDetails, setProjectDetails] = useState([])
    const [projectDescription, setProjectDescription] = useState({})
    const params = useParams()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/projects/${params.id}/actions`)
            .then(res => {
                console.log(res)
                setProjectDetails(res.data)
            })
            .catch(err => {
                console.log(err)
            })

            axios.get(`http://localhost:8000/api/projects/${params.id}`)
            .then(res => {
              console.log(res)
              setProjectDescription(res.data)
            })
            .catch(err => {
              console.log(err)
            })
    }, [params.id])

    return (
<>
        <div className='projectDescription'>
        <h4>Project Description:</h4>
    <p>{projectDescription.description}</p>
        </div>
        <div className='details'>
            <h4>Actions:</h4>
            {!projectDetails.length 
            ? 
            <div className='noActions'> ***This project has no actions :( ***</div> 
            : 
            projectDetails.map(details => {
                console.log(details)
                return (
                    <div className='actionCard'>
                        <h4>Description: {details.description}</h4>
                        <div>Notes: {details.notes} </div>
                    </div>
                )
            })}
        </div>

        </>
    )
}

export default ProjectDetails