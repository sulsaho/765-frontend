import './App.css';
import axios from 'axios'
import {useEffect, useState} from "react";
import {VictoryBar, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme} from "victory";
import moment from 'moment'

//Main App
function App() {
  //Hooks
  const [tracker, setTracker] = useState([]);
  const [timeMins, setTimeMins] = useState(0)
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const [locations, setLocFreq] = useState([]);
  const [categories, setCatFreq] = useState([]);
  const [locationsTime, setLocFreqAgainstTime] = useState([]);
  const [categoriesTime, setCatFreqAgainstTime] = useState([]);

  //Requests
  useEffect( () => {
    async function fetchData (){
      const response = await axios.get('http://localhost:5000/api/trackers');
      
      setTracker(response.data);
    }
    fetchData();
  }, [])

  useEffect( () => {
    async function fetchData (){
      const response = await axios.get('http://localhost:5000/api/trackers/loc_freq');
      
      setLocFreq(response.data);
    }
    fetchData();
  }, [])

  useEffect( () => {
    async function fetchData (){
      const response = await axios.get('http://localhost:5000/api/trackers/cat_freq');
      
      setCatFreq(response.data);
    }
    fetchData();
  }, [])

  useEffect( () => {
    async function fetchData (){
      const response = await axios.get('http://localhost:5000/api/trackers/loc_freq_against_time');
      
      setLocFreqAgainstTime(response.data);
    }
    fetchData();
  }, [])

  useEffect( () => {
    async function fetchData (){
      const response = await axios.get('http://localhost:5000/api/trackers/cat_freq_against_time');
      
      setCatFreqAgainstTime(response.data);
    }
    fetchData();
  }, [])

  async function handleClick() {
    await axios.post('http://localhost:5000/api/trackers', {
      time_mins: timeMins,
      date_tracked: moment(date).toISOString(),
      category: category,
      location: location
    });

    window.location.reload();
  }

  //Inserts
  function handleChangeCategory(event){
    setCategory(event.target.value)
  }

  function handleChangeTime(event){
    const timeInt = parseInt(event.target.value);
    setTimeMins(timeInt);
  }

  function handleChangeDate(event){
    setDate(event.target.value)
  }

  function handleLocationChange(event){
    setLocation(event.target.value)
  }

  return (
    <div className={'container'}>
      <div className={'entries'}>
        <div id={'extra'}>
        </div>
        <div className={'entry'}>
          <input type={'number'} onChange={handleChangeTime} placeholder="Enter time in minutes"/>
        </div>
        <div className={'entry'}>
          <input type={'date'} onChange={handleChangeDate} placeholder="Select date of entry"/>
        </div>
        <div className={'entry'}> 
          {/* <label htmlFor="category">Category:</label> */}
          <select value={category} onChange={handleChangeCategory} name="category" id="category">
            <option value="">--Choose an Category--</option>
            <option value="hanging out">Hanging Out</option>
            <option value="doing assigments">Doing Assigments</option>
            <option value="taking quiz">Taking Quiz</option>
            <option value="working on project">Working on Project</option>
            <option value="studying">Studying</option>
          </select>
        </div>
        <div className={'entry'}>
          {/* <label htmlFor="location">Location:</label> */}
          <select value={location} onChange={handleLocationChange} name="location" id="location">
            <option value="">--Choose a location--</option>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="park">Park</option>
            <option value="library">Library</option>
            <option value="science building">Science Building</option>
          </select>
        </div> 
        <div className={'entry'}>
          <button onClick={handleClick}>Submit</button>
        </div>
        <div>
          <hr></hr>
        </div>
        
      </div>
      <div className={'charts'}>
        <div className={'chart'}>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20} scale={{x: 'time'}} width={1000}>
            <VictoryLabel text={'Minutes Spent Against Dates'} x={70} y={40}/>
            <VictoryLine data={tracker} x={t => moment(t['date_tracked']).toDate()} y={'time_mins'} />
          </VictoryChart>
        </div>
        <div className={'rows'}>
          <div className={'chart'}>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20} width={600}>
            <VictoryLabel text={'Frequency of Locations'} x={70} y={40}/>
            <VictoryBar data={locations} x={'location'} y={'count'}/>
          </VictoryChart>
          </div>
          <div className={'chart'}>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20} width={500}>
              <VictoryLabel text={'Frequency of Categories'} x={70} y={40}/>
              <VictoryBar data={categories} x={'category'} y={'count'}/>
            </VictoryChart>
          </div>
        </div>
        <div className={'rows'}>
          <div className={'chart'}>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20} width={500}>
            <VictoryLabel text={'Minutes Spent Per Location'} x={70} y={40}/>
            <VictoryBar data={locationsTime} x={'location'} y={'count_mins'}/>
          </VictoryChart>
          </div>
          <div className={'chart'}>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20} width={500}>
              <VictoryLabel text={'Minutes Spent Per Category'} x={70} y={40}/>
              <VictoryBar data={categoriesTime} x={'category'} y={'count_mins'}/>
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
