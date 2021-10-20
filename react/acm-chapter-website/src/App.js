import './App.scss';

function App() {
  return (
    <main class="sigs">
    <section class="sigs__landing">
        <div class="sigs__landing__content">
            <h1 class="sigs__landing__content__title">
                Special Interest Groups
            </h1>
            <p class="sigs__landing__content__text">ACM's Special Interest Groups (SIGs) represent major 
                areas of computing, addressing the interests of technical 
                communities that drive innovation. SIGs offer a wealth of 
                conferences, publications and activities focused on specific 
                computing sub-disciplines. They enable members to share expertise, 
                discovery and best practices.
            </p>
        </div>
    </section>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        class="home__wave"
        >
            <path
            fill="#00e1bfcc"
            fill-opacity="1"
            d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            >
            </path>
    </svg>
    <section class="sigs__topics">
        <ul class="sigs__topics__list">
            <li class="sigs__topics__list__element">
                <app-section-title text="'Software Engineering (SWE)'"></app-section-title>
                <p class="sigs__topics__list__element__subtitle">The ACM Special Interest Group on Software Engineering seeks to improve our ability to engineer software by stimulating interaction among practitioners, researchers, and educators; by fostering the professional development of software engineers; and by representing software engineers to professional, legal, and political entities.</p>
                <div class="sigs__topics__list__element__content">
                    <div class="sigs__topics__list__element__content__caption">
                        <h4>Introduction to React</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel faucibus non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel non.</p>
                    </div>
                    <div class="sigs__topics__list__element__content__video">
                        <iframe src="https://www.youtube.com/embed/BHlhxNOEHS4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </li>
            <li class="sigs__topics__list__element">
                <app-section-title text="'Cybersecurity'"></app-section-title>
                <p class="sigs__topics__list__element__subtitle">The ACM Special Interest Group on Cybersecurity seeks is to develop the information security profession by sponsoring high quality research conferences and workshops. SIGSAC conferences address all aspects of information and system security, encompassing security technologies, secure systems, security applications, and security policies. Security technologies include access control, assurance, authentication, cryptography, intrusion detection, penetration techniques, risk analysis, and secure protocols.</p>
                <div class="sigs__topics__list__element__content">
                    <div class="sigs__topics__list__element__content__caption">
                        <h4>Password Managers Workshop</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel faucibus non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel non.</p>
                    </div>
                    <div class="sigs__topics__list__element__content__video">
                        <iframe src="https://www.youtube.com/embed/En07mqDS640" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </li>
        </ul>


    </section>

</main>
  
  );
}

export default App;
