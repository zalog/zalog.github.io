import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [
      {
        name: 'revistavip.net',
        href: 'http://www.revistavip.net/',
        skills: ['html', 'css'],
        year: '2008'
      },
      {
        name: 'americanexperience.ro',
        href: 'https://www.americanexperience.ro/',
        skills: ['html', 'css'],
        year: '2008'
      },
      {
        name: 'turabo-cafe.ro',
        href: '',
        skills: ['html', 'css'],
        year: '2008'
      },
      {
        name: 'bmw.ro',
        href: 'https://www.bmw.ro/',
        skills: ['xml', 'html', 'flash'],
        year: '2008'
      },
      {
        name: 'vibefm.ro',
        href: 'http://www.vibefm.ro/',
        skills: ['html', 'css'],
        year: '2008'
      },
      {
        name: 'sportlaminut.ro',
        href: 'http://www.sportlaminut.ro/',
        skills: ['html', 'css'],
        year: '2009'
      },
      {
        name: 'creativeweek.org',
        href: 'http://www.creativeweek.org/',
        skills: ['wordpress', 'php', 'html', 'css'],
        year: '2009'
      },
      {
        name: 'greenblog.descopera.ro',
        href: 'http://greenblog.descopera.ro/',
        skills: ['wordpress', 'php', 'html', 'css'],
        year: '2009'
      },
      {
        name: 'blog.provideo.ro',
        href: '',
        skills: ['wordpress', 'php', 'html', 'css'],
        year: '2009'
      },
      {
        name: 'intrefete.ro',
        href: '',
        skills: ['html', 'css'],
        year: '2010'
      },
      {
        name: 'm.apropoid.ro',
        href: 'http://m.apropoid.ro/',
        skills: ['html', 'css'],
        year: '2010'
      },
      {
        name: 'prosport.ro - v2010',
        href: '',
        skills: ['html', 'css'],
        year: '2010'
      },
      {
        name: 'soferderomania.promotor.ro - v2010',
        href: '',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2010'
      },
      {
        name: 'liga.prosport.ro - v2010',
        href: '',
        skills: ['html', 'css'],
        year: '2010'
      },
      {
        name: 'fratelli.ro',
        href: 'http://www.fratelli.ro/',
        skills: ['html', 'css'],
        year: '2011'
      },
      {
        name: 'one.ro',
        href: 'http://www.one.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2011'
      },
      {
        name: 'descopera.ro',
        href: 'http://www.descopera.ro/',
        skills: ['html', 'css', 'jQuery'],
        year: '2011'
      },
      {
        name: 'orlando.ro - v2011',
        href: 'http://www.orlando.ro/',
        skills: ['html', 'css', 'wordpress', 'php'],
        year: '2011'
      },
      {
        name: 'storageroom.ro',
        href: 'http://storageroom.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'jQuery', 'javascript'],
        year: '2011'
      },
      {
        name: 'oanacuzino.csid.ro',
        href: 'http://oanacuzino.csid.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'javascript'],
        year: '2011'
      },
      {
        name: 'thecitybreak.ro',
        href: 'http://thecitybreak.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'jQuery', 'javascript'],
        year: '2011'
      },
      {
        name: 'm.apropo.ro',
        href: '',
        skills: ['html', 'css'],
        year: '2011'
      },
      {
        name: 'm.ro',
        href: 'http://www.m.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2011'
      },
      {
        name: 'alo-moda.ro',
        href: 'http://www.alo-moda.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'jQuery', 'javascript'],
        year: '2011'
      },
      {
        name: 'businessdevelopment.ro',
        href: 'http://businessdevelopment.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'jQuery', 'javascript'],
        year: '2012'
      },
      {
        name: 'liga.prosport.ro',
        href: 'http://liga.prosport.ro/',
        skills: ['html', 'css', 'jQuery'],
        year: '2012'
      },
      {
        name: 'gq.ro',
        href: '',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2012'
      },
      {
        name: 'cineconduce.promotor.ro',
        href: 'http://cineconduce.promotor.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2012'
      },
      {
        name: 'travel.descopera.ro',
        href: 'http://travel.descopera.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2012'
      },
      {
        name: 'afiliere.mobilio.ro',
        href: 'http://afiliere.mobilio.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2012'
      },
      {
        name: 'bound.ro',
        href: 'http://bound.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'jQuery', 'javascript'],
        year: '2013'
      },
      {
        name: 'tortionari.gandul.info',
        href: '',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2013'
      },
      {
        name: 'prosport.ro',
        href: 'http://www.prosport.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2013'
      },
      {
        name: 'autopro.ro',
        href: 'http://www.autopro.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2013'
      },
      {
        name: 'tirbuson.ro',
        href: '',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2013'
      },
      {
        name: 'csid.ro',
        href: 'http://www.csid.ro/',
        skills: ['html', 'css', 'jQuery', 'javascript'],
        year: '2013'
      },
      {
        name: 'criserb.com',
        href: 'https://www.criserb.com/blog/',
        skills: ['wordpress', 'php', 'html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript', 'nodejs'],
        year: '2013'
      },
      {
        name: 'nush.ro',
        href: 'https://nush.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript', 'nodejs'],
        year: '2014'
      },
      {
        name: 'cabral.ro',
        href: 'https://www.cabral.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript', 'nodejs'],
        year: '2014'
      },
      {
        name: 'apropotv.ro',
        href: 'http://www.apropotv.ro/',
        skills: ['html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript', 'nodejs'],
        year: '2014'
      },
      {
        name: 'practica-ta.ro',
        href: 'http://www.practica-ta.ro/',
        skills: ['wordpress', 'php', 'mysql', 'html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript', 'nodejs'],
        year: '2014'
      },
      {
        name: 'ozinparis.com',
        href: 'http://ozinparis.com/',
        skills: ['wordpress', 'php', 'html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript'],
        year: '2015'
      },
      {
        name: 'caloria.ro',
        href: 'http://www.caloria.ro/',
        skills: ['html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript'],
        year: '2015'
      },
      {
        name: 'andreeaibacka.ro',
        href: 'https://andreeaibacka.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'less', 'bootstrap', 'jQuery', 'javascript', 'nodejs'],
        year: '2015'
      },
      {
        name: 'republica.ro',
        href: 'https://republica.ro/',
        skills: ['html', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'nodejs', 'git', 'PM'],
        year: '2015'
      },
      {
        name: 'suntmamica.ro',
        href: 'http://www.suntmamica.ro/',
        skills: ['html', 'php', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'nodejs', 'gulp', 'git'],
        year: '2016'
      },
      {
        name: 'gobet.ro',
        href: 'http://www.gobet.ro/',
        skills: ['html', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'nodejs', 'gulp'],
        year: '2016'
      },
      {
        name: 'basilica.ro',
        href: 'http://www.basilica.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'vagrant', 'nodejs', 'gulp', 'git'],
        year: '2016'
      },
      {
        name: 'digi24.ro',
        href: 'https://www.digi24.ro/',
        skills: ['html', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'nodejs', 'gulp', 'git'],
        year: '2016'
      },
      {
        name: 'm.digi24.ro',
        href: 'https://m.digi24.ro/',
        skills: ['html', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'nodejs', 'gulp', 'git'],
        year: '2016'
      },
      {
        name: 'kanald.ro',
        href: 'http://www.kanald.ro/',
        skills: ['html', 'css', 'sass', 'bootstrap', 'javascript', 'nodejs', 'gulp', 'vagrant', 'git'],
        year: '2017'
      },
      {
        name: 'gaseste.ro',
        href: 'http://www.gaseste.ro/',
        skills: ['php', 'html', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'nodejs', 'gulp', 'vagrant', 'git', 'PM'],
        year: '2017'
      },
      {
        name: 'vreaudeviz.ro',
        href: '',
        skills: ['html', 'css', 'sass', 'bootstrap', 'vue.js', 'javascript', 'nodejs', 'gulp'],
        year: '2017'
      },
      {
        name: 'trinitas.tv',
        href: 'https://www.trinitas.tv/',
        skills: ['wordpress', 'php', 'mysql', 'sass', 'bootstrap', 'jQuery', 'javascript', 'nodejs', 'webpack', 'gulp', 'vagrant', 'git', 'ci', 'cd'],
        year: '2017'
      },
      {
        name: 'ROdiaspora',
        href: 'http://ithub.gov.ro/2016/12/09/rodiaspora/',
        skills: ['angular', 'rxjs', 'ionic', 'typescript', 'javascript', 'cordova'],
        year: '2017'
      },
      {
        name: 'iaa.ro',
        href: 'http://www.iaa.ro/',
        skills: ['wordpress', 'php', 'html', 'css', 'sass', 'bootstrap', 'jQuery', 'javascript', 'webpack', 'gulp', 'nodejs', 'git'],
        year: '2018'
      }
    ],
    about: {
      intro: `<p>I am working for 1616.ro, I am from Bucharest, Romania and this is my portfolio.</p>
        <p>Scroll down to see some of my projects</p>.
        <p>Have fun!</p>`,
      text: 'Lorem ipsum'
    },
    socialProfiles: [
      {
        text: 'Linkedin',
        href: 'https://www.linkedin.com/in/zalog/',
        icon: 'fa fa-linkedin',
        footer: true
      },
      {
        text: 'Github',
        href: 'https://github.com/zalog',
        icon: 'fa fa-github',
        footer: true
      },
      {
        text: 'Codepen',
        href: 'https://codepen.io/zalog/',
        icon: 'fa fa-codepen',
        footer: false
      },
      {
        text: 'Stack Overflow',
        href: 'https://stackoverflow.com/users/2977191/zalog',
        icon: 'fa fa-stack-overflow',
        footer: false
      },
      {
        text: 'Medium',
        href: 'https://medium.com/@zalog',
        icon: 'fa fa-medium',
        footer: false
      },
      {
        text: 'Instagram',
        href: 'https://www.instagram.com/czalog/',
        icon: 'fa fa-instagram',
        footer: true
      },
      {
        text: 'ZaBlog',
        href: 'https://zablog.ro/',
        icon: 'fa fa-wordpress',
        footer: false
      },
      {
        text: 'Facebook',
        href: 'https://www.facebook.com/zablog',
        icon: 'fa fa-facebook',
        footer: true
      }
    ]
  },
  mutations: {

  },
  actions: {

  }
})
