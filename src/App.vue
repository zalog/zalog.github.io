<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer class="pa-0" app fixed clipped
        v-model="drawer"
      >

        <v-layout column fill-height>

          <v-list class="pa-0" dense>

            <v-divider></v-divider>

            <v-list-tile to="/">
              <v-list-tile-content>
                <v-list-tile-title v-html="'Projects'" />
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile to="/about">
              <v-list-tile-content>
                <v-list-tile-title v-html="'About'" />
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile to="/contact">
              <v-list-tile-content>
                <v-list-tile-title v-html="'Contact'" />
              </v-list-tile-content>
            </v-list-tile>

          </v-list>

          <v-spacer></v-spacer>

          <v-list class="pa-0 hidden-md-and-up" dense>

            <v-divider></v-divider>
            <v-list-tile v-for="(item, index) in socialProfiles" :key="index" :href="item.href" target="_blank">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.text" />
              </v-list-tile-content>
            </v-list-tile>

          </v-list>

        </v-layout>

      </v-navigation-drawer>

      <v-toolbar app fixed clipped-left dark color="black">
        <v-toolbar-side-icon v-on:click.native="drawer = !drawer" />
        <v-avatar size="36">
          <img src="@/assets/zalog.ro-logo.svg" alt="avatar">
        </v-avatar>
        <v-toolbar-title>Zălog Cătălin</v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="hidden-sm-and-down">
          <v-btn v-for="(item, index) in socialProfiles" :key="index" :href="item.href" target="_blank" icon flat>
            <v-icon size="20px">{{ item.icon }}</v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>

      <v-footer app absolute
        height="auto"
      >
        <v-layout row wrap justify-center>
          <v-layout row wrap justify-center class="hidden-md-and-up">
            <v-btn v-for="(item, index) in socialProfilesFooter" :key="index" :href="item.href" target="_blank" icon flat>
              <v-icon size="20px">{{ item.icon }}</v-icon>
            </v-btn>
          </v-layout>
          <v-flex xs12 py-3 text-xs-center>
            &copy;2018 zalog.ro, +40 721 213 882
          </v-flex>
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null
  }),
  computed: {
    socialProfiles () {
      return this.$store.state.socialProfiles
    },
    socialProfilesFooter () {
      return this.$store.state.socialProfiles.filter((item) => {
        if (item.footer) return item
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Roboto', sans-serif;
}
.toolbar {
  .btn {
    opacity: .4;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
