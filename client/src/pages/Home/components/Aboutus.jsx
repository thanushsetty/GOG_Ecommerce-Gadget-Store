import React from 'react'
import '../styles/aboutus.css'
import { Header } from '../../CommonComponents/components/Header'
import { Footer } from '../../CommonComponents/components/Footer'


export const Aboutus = ({user}) => {
    return (
        <>
            <div style={ { width: '100%', zIndex: '9999', top: '0' } }>
                {/* <Header user={user} /> */}
            </div>
            <div className='aboutus'>

                <main className="about">
                    <section className="about-section">
                        <h1>About Our Company</h1>
                        <p>Welcome to <b>Gadgets of Galaxy</b>, where passion meets purpose in an online marketplace like no other. We are not just a platform; we are a community of visionaries, creators, and enthusiasts united by the love for exceptional products. At <b>Gadgets of Galaxy</b>, we believe in more than just transactions – we believe in connections. Our mission is to curate a diverse selection of premium goods that transcend the ordinary, connecting discerning sellers with savvy buyers. "</p>
                        <p>We're not just simplifying the shopping experience; we're redefining it. From cutting-edge electronics to timeless fashion, our platform is a celebration of quality, authenticity, and innovation. Join us on this journey as we empower sellers, delight buyers, and set the stage for a new era of online shopping excellence.</p>
                    </section>
                    <section className="team-section_1">
                        <h2 className='heading50'>Our Team</h2>
                        <div className="team-member">
                            <h3>Hemanth Adigopula</h3>
                            <p>BTech undergraduate student CSE</p>
                        </div>
                        <div className="team-member">
                            <h3>Thanush Setty</h3>
                            <p>BTech undergraduate student CSE</p>
                        </div>
                        <div className="team-member">
                            <h3>Praveen Kumar </h3>
                            <p>BTech undergraduate student CSE</p>
                        </div>
                        <div className="team-member">
                            <h3>Akhil</h3>
                            <p>BTech undergraduate student CSE</p>
                        </div>
                        <div className="team-member">
                            <h3>Vinay sure</h3>
                            <p>BTech undergraduate student CSE</p>
                        </div>
                    </section>
                </main>
            </div>
                <Footer/>
        </>
    )
};
