<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer app fixed
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
      >

        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://graph.facebook.com/632096343/picture?type=normal" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Catalin Zalog</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list class="pa-0" dense>

          <v-divider></v-divider>

          <v-list-tile to="/">
            <v-list-tile-content>
              <v-list-tile-title v-html="'Home'" />
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

        <v-list class="pa-0 hidden-md-and-up" dense>

          <v-divider></v-divider>
          <v-subheader class="grey--text text--lighten-1">Online</v-subheader>
          <v-list-tile href="#" target="_blank">
            <v-list-tile-action>
              <v-icon>fa fa-linkedin</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="'Linkedin'" />
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="#" target="_blank">
            <v-list-tile-action>
              <v-icon>fa fa-github</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="'Github'" />
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="#" target="_blank">
            <v-list-tile-action>
              <v-icon>fa fa-stack-overflow</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="'Stackoverflow'" />
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="#" target="_blank">
            <v-list-tile-action>
              <v-icon>fa fa-instagram</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="'Instagram'" />
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="#" target="_blank">
            <v-list-tile-action>
              <v-icon>fa fa-wordpress</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="'Blog'" />
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="#" target="_blank">
            <v-list-tile-action>
              <v-icon>fa fa-facebook</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="'Facebook'" />
            </v-list-tile-content>
          </v-list-tile>

        </v-list>

      </v-navigation-drawer>

      <v-toolbar app fixed clipped-left dark>
        <v-toolbar-side-icon v-on:click.native="drawer = !drawer" />
        <v-toolbar-title>Catalin Zalog</v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="hidden-sm-and-down">
          <v-btn href="#" target="_blank" icon flat>
            <v-icon size="20px">fa fa-linkedin</v-icon>
          </v-btn>
          <v-btn href="#" target="_blank" icon flat>
            <v-icon size="20px">fa fa-github</v-icon>
          </v-btn>
          <v-btn href="#" target="_blank" icon flat>
            <v-icon size="20px">fa fa-stack-overflow</v-icon>
          </v-btn>
          <v-btn href="#" target="_blank" icon flat>
            <v-icon size="20px">fa fa-instagram</v-icon>
          </v-btn>
          <v-btn href="#" target="_blank" icon flat>
            <v-icon size="20px">fa fa-wordpress</v-icon>
          </v-btn>
          <v-btn href="#" target="_blank" icon flat>
            <v-icon size="20px">fa fa-facebook</v-icon>
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
            <v-btn href="#" target="_blank" icon flat>
              <v-icon size="20px">fa fa-linkedin</v-icon>
            </v-btn>
            <v-btn href="#" target="_blank" icon flat>
              <v-icon size="20px">fa fa-github</v-icon>
            </v-btn>
            <v-btn href="#" target="_blank" icon flat>
              <v-icon size="20px">fa fa-stack-overflow</v-icon>
            </v-btn>
            <v-btn href="#" target="_blank" icon flat>
              <v-icon size="20px">fa fa-instagram</v-icon>
            </v-btn>
            <v-btn href="#" target="_blank" icon flat>
              <v-icon size="20px">fa fa-wordpress</v-icon>
            </v-btn>
            <v-btn href="#" target="_blank" icon flat>
              <v-icon size="20px">fa fa-facebook</v-icon>
            </v-btn>
          </v-layout>
          <v-flex xs12 py-3 text-xs-center>
            &copy;2018 <strong>zalog.ro</strong>
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
  })
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
