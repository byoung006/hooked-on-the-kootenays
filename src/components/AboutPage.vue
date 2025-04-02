<template>
  <div class="about-container">
    <h1>About Our Application</h1>
    <div class="intro-container">
      <p>
        This website is dedicated to an application that helps outdoor enthusiasts find the perfect combination of
        camping
        and fishing spots in the Kootenay region. We believe that everyone should have the opportunity to experience the
        beauty and tranquility of nature, and we hope that our app will make it easier for people to find the perfect
        place to pitch a tent and cast a line.
      </p>
      <p>
        Our mission is to provide a comprehensive and user-friendly resource for outdoor enthusiasts who want to explore
        the Kootenay region. We want to make it easy for people to find information about camping and fishing spots, as
        well as other outdoor activities. We also want to provide a platform for people to share their experiences and
        recommendations with others.
      </p>

    </div>
    <h1>Our Team</h1>
    <div class="team-members">
      <div class="team-member">
        <h2>Hannah Murphy</h2>
        <h3>GIS data lead, and project director</h3>
        <p>Hannah Murphy is a GIS professional passionate about leveraging spatial data for fisheries conservation.
          She
          skillfully translates complex environmental data into clear, actionable maps and analyses. In her work,
          Hannah
          meticulously ensures data accuracy and employs the latest GIS techniques, demonstrating a commitment to
          professional excellence. She understands the critical role of spatial information in understanding fish
          populations, habitat health, and the impacts of environmental change. Driven by a deep love for aquatic
          ecosystems, Hannah dedicates her expertise to supporting sustainable fisheries management and protecting
          vital
          aquatic habitats. Her work reflects a genuine dedication to conservation, using the power of GIS to make a
          real difference for our waterways.</p>
      </div>

      <div class="team-member">
        <h2>Bryce Young</h2>
        <h3>Lead Developer</h3>
        <p>Bryce Young is a software developer with a passion for creating innovative and user-friendly solutions. He
          has a keen eye for detail and a commitment to delivering high-quality code. His personal interest in fishing
          and camping inspires him to develop software that helps people across a variety of
          technologies and interests. He works with a variety of technologies day to day, and has a
          keen eye on the technology sector, especially in how technology interfaces with nature</p>
      </div>

    </div>
    <h2>Contact Us</h2>
    <div class="contact-container">
      <p>
        We are always looking for ways to improve our app and make it more useful for our users
        through an Open Source aprroach. We are also planning to
        add new features in the future, such as information about hiking trails and other outdoor activities. We hope
        that
        you will join us on our journey to explore the Kootenay region.

      </p>

    </div>
    <p class="email-container">Email: <a href="mailto:byoung006@gmail.com">byoung006@gmail.com</a></p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'About-Page',
};
</script>

<style scoped>
.about-container {
  display: grid;
  grid-auto-flow: row;
  max-width: 80vw;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about-container h1,
.about-container h2 {
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
}

/*.about-container p {*/
/*  color: #666;*/
/*  line-height: 1.6;*/
/*  margin-bottom: 1rem;*/
/*  text-align: center;*/
/*}*/

.intro-container {
  display: grid;
  grid-auto-flow: row;
  justify-content: space-around;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
}

.intro-container p {
  color: #666;
  line-height: 1.5;
  grid-template-columns: 1fr;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 2rem 2rem;
}

.team-members {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-around;
  margin-top: 2rem;
  flex-direction: row;
}

.team-member {
  text-align: center;
  padding: 10%;
}

.team-member-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.team-member h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.team-member p {
  color: #666;
  margin-bottom: 0.5rem;
}

.contact-container {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-around;
  margin-top: 2rem;
}

.contact-container p {
  color: #666;
  line-height: 1.5;
  grid-template-columns: 1fr;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 2rem 4rem;
}

.email-container {
  display: grid;
  grid-auto-flow: row;
  line-height: 1.5;
  grid-template-columns: 1fr;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 2rem 2rem;
}
</style>
