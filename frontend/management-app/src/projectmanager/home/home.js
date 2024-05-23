import './home.css'

export default function Home(props) {

    return(
        <div className="project-home">
            <div className='header-content'>
                <div className='greeting'>
                    <h1>Good morning, John Doe!</h1>
                    <h2>Ask me anything using the chat bar below</h2>
                </div>
                <div className='task-tracker'>
                    <div>
                        <h1>7 <span className='tracker-title'>To Do Today</span></h1>
                    </div>
                    <div>
                        <h1>2 <span className='tracker-title'>In Progress</span></h1>
                    </div>
                    <div>
                        <h1>4 <span className='tracker-title'>Completed Today</span></h1>
                    </div>
                </div>
            </div>
            <div className='info-cards'>
                bottom
            </div>
        </div>
    );
}