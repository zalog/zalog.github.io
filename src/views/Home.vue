<template>
  <div>

    <h1 class="mb-3">My projects</h1>

    <v-container class="pa-0" fluid grid-list-lg>

      <v-layout row wrap>
        <v-flex v-for="(item, index) in projects" :key="index" xs12 sm6>
          <Project
            :name="item.name"
            :href="item.href"
            :skills="item.skills"
            :year="item.year"
          />
        </v-flex>
      </v-layout>

    </v-container>

  </div>
</template>

<script>
import Project from '@/components/Project.vue'

export default {
  name: 'home',
  components: {
    Project
  },
  computed: {
    projects () {
      return this.$store.state.projects.slice().sort((a, b) => {
        if (a.year < b.year) return 1
        if (a.year > b.year) return -1
        return 0
      })
    }
  }
}
</script>
