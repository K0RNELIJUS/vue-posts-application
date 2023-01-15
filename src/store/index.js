import Vue from 'vue';
import Vuex from 'vuex';
import posts from './modules/posts';
import authors from './modules/authors';
import modal from './modules/modal';

//dispatch => actions => mutations

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    posts,
    authors,
    modal
  }
});
