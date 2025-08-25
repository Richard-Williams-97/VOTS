import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../Images/VOTSlogo.png"
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
  <div>
    <div className="page-heading">
      <h1 className="variable-glow" >Welcome to the Verse of the Sun</h1>
      <p style={{color: "grey"}}>A universe by Richard Williams III</p>
    </div>
    <div>
      <div style={{paddingBottom: "60px", fontSize: "15pt"}}>
        <p style={{textWrap: "pretty", padding: "0 100px"}}>
        The Verse of the Sun is a science fiction collection that envisions a near future where humanity has reached the edge of the solar system and its population has exploded. 
        The inhabitants of the Solar Empire lead fulfilling and liberated lives, surrounded by the awe-inspiring and chaotic wonders of cutting-edge technologies that seemingly make the impossible commonplace. 
        This transformative technology, both creative and destructive, shapes the solar system around them, capable of altering the lives of billions in an instant.
        The Verse of the Sun encompasses both literal events and symbolic representations of the universe. 
        Through its content, I aim to portray the stories, culture, and daily lives of the people inhabiting this cosmic realm.
        Please enjoy the Stories and Games, and I hope you’ll check in periodically. I will be updating this project regularly.
        </p>
      </div>
      <div style={{display: 'flex', width: "100%", flexDirection: 'row', gap: '10px', justifyContent: "center", paddingBottom: "60px"}}>
      
      <div className='homeDetail' onClick={() => navigate('/stories')} style={{cursor: "pointer"}}>
        <h2>Stories</h2>
        <p>
          Explore a collection of short stories that delve into the lives of individuals, groups, and events that unfold within the verse. Through these narratives, I hope to unravel the mysteries, achievements, and tragedies that have shaped the time period.
        </p>
      </div>
      {/* TODO: add vertical white line here with image of sun above and moon below
      and small down arrow, maybe a bit hard to make align, but go with best fit and see what it looks like when we use it */}
      <div style={{margin:"0 70px", width: "30px", height: "100%", left: "50%", top: "0", bottom: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <img style={{width: "100%", height: "100%"}}  src={logo}/>
        <div style={{width: "2px", height: "170px", backgroundColor: "white", marginTop: "10px", marginBottom: "10px"}} />
        <img  style={{width: "100%", height: "100%"}} src={logo}/>
      </div>
      
      <div className='homeDetail' onClick={() => navigate('/games')} style={{cursor: "pointer"}}>
        <h2>Games</h2>
        <p>
          This collection of short stories delves into the lives of individuals, groups, and events that unfold within the verse. Through these narratives, I hope to unravel the mysteries, achievements, and tragedies that have shaped the time period.
        </p>
      </div>
      
      </div>
      <div style={{paddingBottom: "10px", fontSize: "15pt", textAlign: "center"}}>
        <h2 style={{paddingBottom: "10px"}}>Support</h2>
        <p style={{textWrap: "pretty"}}>
          If you wish to support, just buy the games when they come out. Thank you!
        </p>
      </div>
    </div>
    
  </div>
  );
};

export default Home; 