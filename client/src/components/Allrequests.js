import React,{useState,useEffect,useContext} from 'react';
import { makeStyles }  from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Grid } from "@material-ui/core";
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CallIcon from '@material-ui/icons/Call';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import '../App.css'
import { IconButton } from '@material-ui/core';
import {WhatsappShareButton,WhatsappIcon} from "react-share";
import {UserContext} from "../App"
const useStyles = makeStyles({
  root: {
    backgroundColor:"#CF0029"
  },
  gridContainer: {
    paddingLeft: "40px",
    paddingRight: "40px",
  }
});
const Allrequests=()=>
{
  const {state}=useContext(UserContext)
  const [upload,setUpload]=useState([]);
  const classes = useStyles();
  useEffect(()=>{
    fetch("/allrequests",{
     headers:{
         "Authorization":"Bearer "+localStorage.getItem("jwt")
     },
    }).then(res=>res.json())
    .then(data=>{
        setUpload(data.posts)
    }).catch(error=>{
        console.log(error)
    })
 },[])
 const deletePost = (postid)=>{
  fetch(`/deleterequest/${postid}`,{
      method:"delete",
      headers:{
          Authorization:"Bearer "+localStorage.getItem("jwt")
      }
  }).then(res=>res.json())
  .then(result=>{
      const newData = upload.filter(item=>{
          return item._id !== result._id
      })
      setUpload(newData)
  })
}
return (
  <Grid
  container
  spacing={4}
  className={classes.gridContainer}
>
        {
            upload.map(item=>{
              const {_id}=item.postedBy;
                return(
                 
                    <Grid  key={item._id} item xs={12} sm={6} md={4} display="inline-block">
                  <Card className={classes.root} xs={12} sm={6} md={4} >
                  <CardContent> 
                    {_id ===state._id &&  <div class="icon"><IconButton onClick={()=>deletePost(item._id)}>
                <ClearRoundedIcon/>
                </IconButton></div> }
                <Typography>
                      {item.name}
                    </Typography>
                    <Typography>
                      {item.bloodgroup}
                    </Typography>
                    <Typography>
                      {item.hospital}
                    </Typography>
                    <Typography>
                      {item.city},{item.state},{item.country}
                    </Typography>
                    <Typography>
               <a href={`tel:${item.phonenumber}`}><span style={{float:'left'}}><CallIcon/></span></a>
                  {item.phonenumber}
                </Typography>
                <div style={{float:'right' ,paddingRight:"20px"}}>
                <WhatsappShareButton 
                title={` *****BLOOD REQUEST***** \n NAME:${item.name} \n BLOOD GROUP:${item.bloodgroup} \n HOSPITAL: ${item.hospital} \n COUNTRY:${item.country} \n PHONE:${item.phonenumber} \n`}
                url={"http://localhost:3000/open"}
                >
                 <WhatsappIcon size={36} borderRadius={40}/>
              </WhatsappShareButton>
              </div>
                  </CardContent>
                </Card>
                </Grid>
               
                )
            })
        }
  </Grid>
  
);
}
export default Allrequests