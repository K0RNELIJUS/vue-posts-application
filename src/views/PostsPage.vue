<template>
  <main>
    <section class="section fullheight">
      <div
        class="is-flex is-justify-content-space-between is-flex-wrap-wrap-reverse"
      >
        <button class="button is-primary mb-5" @click="openModalSetMode">
          Create new article
        </button>
        <!-- Search -->
        <Search @search="handleSearch" />
      </div>
      <!-- Posts -->
      <div class="columns is-flex-wrap-wrap">
        <div
          class="column is-flex is-justify-content-center"
          v-if="!paginatedPosts.length && !searchTerm.length"
        >
          <h4 class="is-size-4">No articles posted yet</h4>
        </div>
        <div
          class="column is-flex is-justify-content-center"
          v-if="!paginatedPosts.length && searchTerm.length"
        >
          <h4 class="is-size-4">Nothing found...</h4>
        </div>

        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="column is-6-tablet is-4-desktop"
        >
          <Card :authors="allAuthors" :post="post" :id="post.id"></Card>
        </div>
      </div>
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @pageChanged="changePage"
      />
    </section>
  </main>
</template>

<script>
// Vuex
import { mapGetters, mapActions } from 'vuex';
// Components
import Search from '../components/Search.vue';
import Card from '../components/Card.vue';
import Pagination from '../components/Pagination.vue';

export default {
  name: 'posts-page',
  components: { Search, Card, Pagination },
  data() {
    return {
      // Pagination
      currentPage: 1,
      postsPerPage: 6,
      searchTerm: ''
    };
  },

  methods: {
    ...mapActions([
      'fetchAuthors',
      'openModal',
      'createMode',
      'closeMessage',
      'fetchPaginatedPosts',
      'messageContent',
      'openModal',
      'openMessage'
    ]),
    // Open modal and set mode to create
    openModalSetMode() {
      this.openModal();
      this.createMode();
      this.closeMessage();
    },
    // Get author name
    getAuthorName(authorId) {
      const author = this.allAuthors.find(author => author.id === authorId);
      return author ? author.name.toLowerCase() : '';
    },
    // Search
    handleSearch(searchTerm) {
      this.searchTerm = searchTerm.toString().toLowerCase();
      this.currentPage = 1;
    },
    // Pagination
    changePage(newPage) {
      this.currentPage = newPage;
    }
  },

  computed: {
    ...mapGetters([
      'paginatedPosts',
      'allAuthors',
      'postsInTotal',
      'postsError'
    ]),

    pageLength() {
      return this.paginatedPosts.length;
    },
    // Pagination and Search
    totalPages() {
      if (this.searchTerm === '') {
        return Math.ceil(this.postsInTotal / this.postsPerPage);
      } else {
        let filteredPosts = this.paginatedPosts.filter(
          post =>
            post.title.toLowerCase().includes(this.searchTerm) ||
            post.body.toLowerCase().includes(this.searchTerm)
        );
        return Math.ceil(filteredPosts.length / this.postsPerPage);
      }
    },
    filteredPosts() {
      let filteredPosts = this.paginatedPosts;
      if (this.searchTerm) {
        filteredPosts = filteredPosts.filter(
          post =>
            post.title.toLowerCase().includes(this.searchTerm) ||
            post.body.toLowerCase().includes(this.searchTerm) ||
            post.created_at.includes(this.searchTerm) ||
            post.updated_at.includes(this.searchTerm) ||
            this.getAuthorName(post.author).includes(this.searchTerm)
        );
      }
      return filteredPosts;
    }
  },

  async created() {
    await this.fetchAuthors();
    await this.fetchPaginatedPosts({
      page: this.currentPage,
      limit: this.postsPerPage,
      searchTerm: this.searchTerm
    });
    if (this.postsError) {
      this.messageContent({
        title: 'Error',
        body: 'Something went wrong',
        isDelete: false,
        isSuccess: false,
        isError: true
      });
      this.openModal();
      this.openMessage();
    }
  },

  watch: {
    // If current page changes, fetch new posts
    currentPage(newPage, oldPage) {
      if (newPage !== oldPage) {
        this.fetchPaginatedPosts({
          page: newPage,
          limit: this.postsPerPage,
          searchTerm: this.searchTerm
        });
      }
    },
    // If search term changes, fetch new posts
    searchTerm(newTerm, oldTerm) {
      if (newTerm !== oldTerm) {
        this.fetchPaginatedPosts({
          page: this.currentPage,
          limit: this.postsPerPage,
          searchTerm: newTerm
        });
      }
    },
    // If page length changes, fetch new posts
    pageLength(newLength, oldLength) {
      if (newLength !== oldLength) {
        this.fetchPaginatedPosts({
          page: this.currentPage,
          limit: this.postsPerPage,
          searchTerm: this.searchTerm
        });
      }
      // If page length is 0 and current page is not 1, go to previous page
      if (newLength === 0 && this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
      }
    }
  }
};
</script>

<style>
.fullheight {
  min-height: 100vh;
}
</style>
