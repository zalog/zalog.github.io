<template>
  <v-card color="blue-grey lighten-5 project" class="black--text" height="100%" flat>
    <v-card-title primary-title>
      <div>
        <h3 class="headline">{{ name }}</h3>
        <div v-html="getSkills"></div>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn :href="href" target="_blank" flat>Visit</v-btn>
      <v-spacer></v-spacer>
      <v-btn flat disabled>{{ year }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Project',
  props: {
    name: String,
    href: String,
    skills: Array,
    year: String
  },
  computed: {
    getSkills () {
      let output = ''
      this.skills.map((item, index) => {
        if (index !== 0) output += ', '
        output += `<span>${item}</span>`
      })
      return output
    }
  }
}
</script>

<style scoped lang="scss">
.project {
  display: flex;
  height: 100%;
  flex-direction: column;
  > *:last-child { margin-top: auto; }
}
</style>
