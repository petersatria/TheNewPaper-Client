import { defineStore } from 'pinia'
import axios from 'axios'
import { errorHandler, toast } from '../helpers/helper'

export const useArticleStore = defineStore('article', {
  state: () => ({
    baseUrl: 'https://news-server.petersox.online',
    articles: [],
    article: {},
    detailName: '',
    detailCategory: '',
    articleQR: '',
    latestArticle: [],
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    categories: [],
    allArticles: []
  }),
  getters: {

  },
  actions: {
    async fetchArticles(size, page, filter) {
      try {
        let url = this.baseUrl + `/api/articles?page[size]=${size}`
        if (page) {
          url = this.baseUrl + `/api/articles?page[size]=${size}&page[number]=${page}`
        }
        if (filter) {
          url = this.baseUrl + `/api/articles?page[size]=${size}&page[number]=${page}&filter[category]=${filter}`
        }
        if (!size && !page && !filter) {
          url = this.baseUrl + `/api/articles`
        }
        const { data } = await axios({ url })
        if (!size && !page && !filter) {
          this.allArticles = data.data.rows
        } else {
          this.articles = data.data.rows
          this.currentPage = data.currentPage
          this.totalItems = data.totalItems
          this.totalPages = data.totalPages
        }
      } catch (err) {
        errorHandler(err)
      }
    },
    async fetchArticleById(id) {
      try {
        const { data } = await axios({
          url: this.baseUrl + `/api/articles/${id}`
        })
        this.article = data.data
        this.detailCategory = data.data.Category.name
        this.detailName = data.data.User.username
      } catch (err) {
        errorHandler(err)
      }
    },
    async getQrCode(id) {
      try {
        const { data } = await axios({
          method: 'POST',
          url: this.baseUrl + `/api/articles/${id}`
        })
        this.articleQR = data
      } catch (err) {
        errorHandler(err)
      }
    },
    async fetchCategories() {
      try {
        const { data } = await axios({
          url: this.baseUrl + `/api/categories`
        })
        this.categories = data.data
      } catch (err) {
        errorHandler(err)
      }
    },
    clearFilter() {
      this.router.replace('/')
      this.fetchArticles(9, 1)
    },
    async fetchAllArticles() {
      try {
        let url = this.baseUrl + `/api/articles`
        const { data } = await axios({ url })
        this.allArticles = data.data.rows
      } catch (err) {
        errorHandler(err)
      }
    },
  },
})