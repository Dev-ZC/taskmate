import checkIcon from './check.png'
import '../../App.css'
import './pricing.css'

export default function Pricing() {
    // Possible use mapping to populate each pricing card

    return(
        <div className="pricing-container">
            <div>
                <h1>
                    This is a good tagline
                </h1>
            </div>
            <div className='pricing-card-holder'>
                <PricingCard 
                    planName = "Free"
                    price = "$0"
                />
                <PricingCard 
                    planName = "Basic"
                    price = "$8"
                />
                <PricingCard 
                    planName = "Pro"
                    price = "$20"
                />
            </div>  
        </div>
    );
}

function PricingCard(props) {

    return(
        <div className="pricing-card">
            <div className='pricing-card-title-container'>
                <h2 className='pricing-card-title'>{props.planName}</h2>
                <h2 className='pricing-card-price'>{props.price}</h2>
            </div>
            <div className='pricing-card-content-holder'>
                <Feature content="Feature 1"/>
                <Feature content="Feature 2"/>
                <Feature content="Feature 3"/>
            </div>
        </div>
    )
}

function Feature(props) {

        return(
            <div>
                <img src={checkIcon}></img>
                <p>{props.content}</p>
            </div>
        )
}