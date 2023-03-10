import axios from 'axios';

// --- State
const state = {
  posts: [],
  singlePost: {},
  currentActivePostId: '',
  postsInTotal: 0,
  error: ''
};

// --- Getters
const getters = {
  paginatedPosts: state => state.posts,
  singlePost: state => state.singlePost,
  currentActivePostId: state => state.currentActivePostId,
  postsError: state => state.error,
  postsInTotal: state => state.postsInTotal
};

//  --- Actions
const actions = {
  // Fetch paginated posts
  async fetchPaginatedPosts({ commit }, pagination) {
    try {
      const res = await axios.get(
        `http://localhost:3000/articles?_page=${pagination.page}&_limit=${pagination.limit}&q=${pagination.searchTerm}`,
        { headers: 'X-Total-Count' }
      );
      commit('SET_POSTS', res.data);
      commit('SET_POSTS_IN_TOTAL', res.headers['x-total-count']);
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },

  // - Posts
  // Create new post
  async addPost({ commit }, newPost) {
    try {
      const { data } = await axios.post(
        'http://localhost:3000/articles',
        newPost
      );
      commit('ADD_NEW_POST', data);
    } catch (error) {
      commit('SET_ERROR', error.message);
      console.log('state error', error.message);
    }
  },

  // Delete post
  async deletePost({ commit }, id) {
    try {
      await axios.delete(`http://localhost:3000/articles/${id}`);
      commit('REMOVE_POST', id);
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },

  //  - Single post

  async fetchPost({ commit }, id) {
    try {
      const { data } = await axios.get(`http://localhost:3000/articles/${id}`);
      commit('SET_SINGLE_POST', data);
    } catch (error) {
      commit('SET_ERROR', error.message);
      console.log('state error', error);
    }
  },

  findSinglePost({ commit }, id) {
    const post = state.posts.find(post => post.id == id);
    commit('SET_SINGLE_POST', post);
  },

  resetSinglePost({ commit }) {
    commit('RESET_SINGLE_POST');
  },

  async updatePost({ commit }, updatedPost) {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/articles/${updatedPost.id}`,
        updatedPost
      );
      commit('UPDATE_POST', data);
    } catch (error) {
      commit('SET_ERROR', error.message);
    }
  },
  // Set current active post id
  setCurrentActivePostId({ commit }, id) {
    commit('SET_CURRENT_ACTIVE_POST_ID', id);
  },
  // Reset error
  clearError({ commit }) {
    commit('SET_ERROR', '');
  }
};

// --- Mutations
const mutations = {
  SET_POSTS: (state, posts) => (state.posts = posts),
  // Create new post
  ADD_NEW_POST: (state, newPost) => state.posts.push(newPost),
  // Delete post
  REMOVE_POST: (state, id) => {
    state.posts = state.posts.filter(post => post.id !== id);
  },
  // Update post
  UPDATE_POST: (state, updatedPost) => {
    const index = state.posts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      state.posts.splice(index, 1, updatedPost);
    }
  },
  // Single post
  SET_SINGLE_POST: (state, post) => (state.singlePost = post),
  RESET_SINGLE_POST: state => (state.singlePost = {}),
  // Set current active post id
  SET_CURRENT_ACTIVE_POST_ID: (state, id) => (state.currentActivePostId = id),
  // Error
  SET_ERROR: (state, error) => (state.error = error),
  // Set posts in total
  SET_POSTS_IN_TOTAL: (state, postsInTotal) => {
    state.postsInTotal = postsInTotal;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
