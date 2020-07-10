import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {Route, Link} from 'react-router-dom'
import ProjectDetails from './ProjectDetails'

import './App.css';


function App() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    axios.get("https://marta-node-sprint.herokuapp.com/api/projects")
      .then(res => {
        console.log(res)
        setProjects(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className="App">

      <h2>Projects list:</h2>
      <h6>** Click on each project to see their actions **</h6>
      {projects.map(project => {
        return (
          <div className='projectCard'>
            <Link to={`/project/${project.id}`}> {project.name} </Link>
          </div>
        )
      })}

      {/* Routes: */}
      <Route path='/project/:id' component={ProjectDetails} />

    </div>
  );
}

export default App;
