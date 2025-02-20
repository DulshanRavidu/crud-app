import { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CRUD = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const[name,setName] = useState('')
    const[age,setAge] = useState('')
    const[IsActivee,setIsActivee] = useState(0)

    const[editID, setEditId] = useState('');
    const[editname,setEditName] = useState('')
    const[editage,setEditAge] = useState('')
    const[editIsActivee,setEditIsActivee] = useState(0)


  const empdata = [

    { 
      id : 1,
      name : 'Manoj',
      age : 29,
      isActivee : 1

    },

    { 
        id : 2,
        name : "virat",
        age : 30,
        isActivee : 1
  
      },

      { 
        id : 3,
        name : 'Rohit',
        age : 34,
        isActivee : 1
  
      }



  ]


   const [data, setData] = useState([]);

    useEffect(()=>{

      getData();

    },[])

    const getData = () =>{
      axios.get('https://localhost:7162/api/Employee')
      .then((result)=>{
        setData(result.data)
      })
       .catch((error) => {
        console.log(error)
       })
    }



    const handleEdit =(id) => {
       handleShow();
       axios.get(`https://localhost:7162/api/Employee/${id}`)
       .then((result)=>{
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setEditIsActivee(result.data.isActivee);
        setEditName(result.data.name);
        setEditId(id);
      })
       .catch((error) => {
        console.log(error)
       })
    }

    const handleDelete =(id) => {

        if(window.confirm("Are you sure to delete this employee") == true){
            axios.delete(`https://localhost:7162/api/Employee/${id}`)
            .then((result)=>{
              if(result.status === 200){
                toast.success('Employee has been deleted');
                getData();
              }
            })

            .catch((error)=>{
              toast.error(error);
            })

        }
 
     }

    const handleUpdate =()=> {
        const url = `https://localhost:7162/api/Employee/${editID}`;
        const data = {
            "id": editID,
            "name": editname,
            "age": editage,
            "IsActivee": editIsActivee
          }
    
          axios.put(url, data)
          .then((result) =>{
            handleClose();
            getData();
            clear();
            toast.success('Employee has been updated');
          }).catch((error)=>{
            toast.error(error);
          })
        
    }

    const handleSave =() =>{
      const url = 'https://localhost:7162/api/Employee';
      const data = {
        "name": name,
        "age": age,
        "IsActivee": IsActivee
      }

      axios.post(url, data)
      .then((result) =>{
        getData();
        clear();
        toast.success('Employee has been added');
      }).catch((error)=>{
        toast.error(error);
      })

    }

    const clear = () =>{
      setName('');
      setAge('');
      setIsActivee(0)
      setEditName('');
      setEditAge('');
      setEditIsActivee(0);
      setEditId('');
    }


    const handleActiveChange = (e) => {
         if(e.target.checked){
            setIsActivee(1);
         }
         else{
            setIsActivee(0);
         }
    } 


    const handleEditActiveChange = (e) => {
      if(e.target.checked){
        setEditIsActivee(1);
      }
      else{
        setEditIsActivee(0);
      }
 } 


    return(
       
<Fragment>

<ToastContainer/>


    <Container>
     
       <Row>
            <Col>
              <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e)=> setName(e.target.value)} />
            </Col>
            <Col>
              <input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e)=> setAge(e.target.value)} />
            </Col>
            <Col>
              <input type="checkbox" checked={IsActivee === 1 ? true: false} onChange={(e)=> handleActiveChange(e)} value={IsActivee}/>
              <label>isActivee</label>
            </Col>
            <Col>
               <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
            </Col>

        </Row>
    </Container>
    <br></br>


        <Table striped bordered hover>
            <thead>
              <tr>
                 <th>#</th>
                 <th>Name</th>
                 <th>Age</th>
                 <th>isActivee</th>
                 <th>Actions</th>
               </tr>
             </thead>
           <tbody>

        {

            data && data.length > 0 ?
            data.map((item, index) => {

                return(
                        <tr key={index}>
                             <td>{index+ 1}</td>
                             <td>{item.name}</td>
                             <td>{item.age}</td>
                             <td>{item.isActivee}</td>
                             <td colSpan={2}>
                                <button className="btn btn-primary" onClick={()=> handleEdit(item.id)}>Edit</button> &nbsp;
                                <button className="btn btn-danger" onClick={()=> handleDelete(item.id)}>Delete</button>

                             </td>
                        </tr>
                )
            })
            :
            'loading...'


        }
        
      
            </tbody>
    </Table>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <Row>
            <Col>
              <input type="text" className="form-control" placeholder="Enter Name" value={editname} onChange={(e)=> setEditName(e.target.value)} />
            </Col>
            <Col>
              <input type="text" className="form-control" placeholder="Enter Age" value={editage} onChange={(e)=> setEditAge(e.target.value)} />
            </Col>
            <Col>
              <input type="checkbox" checked={editIsActivee === 1 ? true: false} onChange={(e)=> handleEditActiveChange(e)} value={editIsActivee}/>
              <label>isActive</label>
            </Col>
            </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>



        </Fragment>
    )
  }

export default CRUD;   