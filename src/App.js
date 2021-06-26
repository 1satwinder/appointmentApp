import React, {useCallback,useState, useEffect} from 'react';
import {BiCalendar} from 'react-icons/bi';
import Search from './Components/Search'
import AddAppointment from './Components/AddAppointment'
import AppointmentList from './Components/AppointmentList'

function App(){
    
    let [appointmentdata, setappointmentdata] = useState([]); // empty array
    let [query, setquery] = useState("");
    let [sortBy, setSortBy] = useState("petName");
    let [orderBy, setOrderBy] = useState("asc");

    const filterAppointements = appointmentdata.filter(
        item => {
            return (
                item.petName.toLowerCase().includes(query.toLowerCase()) ||
                item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
                item.aptNotes.toLowerCase().includes(query.toLowerCase())
            )
        }
    ).sort( (a,b) => {
        let x = a[sortBy].toLowerCase();
        let y = b[sortBy].toLowerCase();

        let order = orderBy === "asc" ? 1 : -1;

        return x===y ? 0 : x > y ?  1*order: -1*order;
    });

    const fetchData = useCallback( () => {
        fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            setappointmentdata(data)
        })
    }, [])

    useEffect( () => {
        fetchData()
    },[fetchData])

    const deleteappointment = (appointmentId) =>{
        setappointmentdata(appointmentdata.filter((appointment) => appointment.id !== appointmentId))
    }
    return (
            <div className="App container mx-auto mt-3 font-thin">
            <h1 className="text-5xl mb-2">
                <BiCalendar className="text-red-400 text-5xl inline-block" />
                Your Appointments 
            </h1>
            <AddAppointment
            onSendAppointment={myAppointment => setappointmentdata([...appointmentdata, myAppointment])}
            lastId={appointmentdata.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
            />

            <Search query={query} 
           onQueryChange={myQuery => setquery(myQuery)}
           sortBy = {sortBy}
           sortByChange = {mySort => setSortBy(mySort)}
           orderBy = {orderBy}
           orderByChange = {myOrder => setOrderBy(myOrder)}
           ></Search>

            <AppointmentList appointmentdata = {filterAppointements} 
            onDeleteAppointment = { deleteappointment }/>
           </div>
           );
}

export default App;