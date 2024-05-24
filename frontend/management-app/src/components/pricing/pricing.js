import checkIcon from './check.png'
import '../../App.css'
import './pricing.css'

export default function Pricing() {
    // Possible use mapping to populate each pricing card
    const featuresArray1 = ["Feature 1", "Feature 2", "Feature 3"];
    const featuresArray2 = ["Feature 4", "Feature 5"];
    const featuresArray3 = ["Feature 6", "Feature 7", "Feature 8", "Feature 9"];

    const btnContent1 = "Get Started"
    const btnContent2 = "Get Started"
    const btnContent3 = "Get Started"

    return(
        <div className="pricing-container">
            <div>
                <h1 className='pricing-tagline'>
                    Automate daily tasks. <br></br>quickly and easily.
                </h1>
            </div>
            <div className='pricing-card-holder'>
                <PricingCard 
                    id = "0"
                    planName = "Basic"
                    price = "Free"
                    features = {featuresArray1}
                    btnContent = {btnContent1}
                />
                <PricingCard 
                    id = "1"
                    planName = "Standard"
                    price = "$8"
                    features = {featuresArray2}
                    btnContent = {btnContent2}
                />
                <PricingCard 
                    id = "2"
                    planName = "Pro"
                    price = "$20"
                    features = {featuresArray3}
                    btnContent = {btnContent3}
                />
            </div>  
        </div>
    );
}

function PricingCard(props) {
    let idColor = ""
    if (props.id === "0"){
        idColor = "card-one-color"
    } else if (props.id === "1"){
        idColor = "card-two-color"
    } else if (props.id === "2"){
        idColor = "card-three-color"
    }

    return(
        <div className="pricing-card" id={idColor}>
            <div className='pricing-card-title-container'>
                <h2 className='pricing-card-title'>{props.planName}</h2>
                <h2 className='pricing-card-price'>{props.price}</h2>
                <p>Monthly</p>
            </div>
            <div className='pricing-card-content-holder'>
                {props.features.map((feature, index) => (
                    <Feature key={index} content={feature} />
                ))}
            </div>
            <div className='pricing-btn-holder'>
                <a href="/login" className='pricing-btn'>{props.btnContent}</a>
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