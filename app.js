import { getLessons, postOrder, updateLessonSpaces, searchLessons } from './api.js';
const { createApp } = Vue;

createApp({
  data() {
    return {
      lessons: [],
      cart: [],
      showCart: false,
      sortKey: 'subject',
      ascending: true,
      searchQuery: '',
      name: '',
      phone: '',
      orderConfirmed: false,
    };
  },
  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        const modifier = this.ascending ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    },
    filteredLessons() {
      const query = this.searchQuery.toLowerCase();
      return this.sortedLessons.filter(
        lesson =>
          lesson.subject.toLowerCase().includes(query) ||
          lesson.location.toLowerCase().includes(query) ||
          lesson.price.toString().includes(query) ||
          lesson.spaces.toString().includes(query)
      );
    },
    validForm() {
      const nameRegex = /^[a-zA-Z\s]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return nameRegex.test(this.name) && phoneRegex.test(this.phone);
    },
    cartTotal() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  methods: {
    toggleOrder() {
      this.ascending = !this.ascending;
    },
    async addToCart(lesson) {
      if (lesson.spaces <= 0) return;

      const existing = this.cart.find(item => item._id === lesson._id);
      if (existing) {
        existing.quantity++;
      } else {
        this.cart.push({ ...lesson, quantity: 1 });
      }

      lesson.spaces--;
      await updateLessonSpaces(lesson._id, lesson.spaces);
    },
    async removeFromCart(index) {
      const item = this.cart[index];
      const lesson = this.lessons.find(l => l._id === item._id);
      if (lesson) {
        lesson.spaces += item.quantity;
        await updateLessonSpaces(lesson._id, lesson.spaces);
      }
      this.cart.splice(index, 1);
    },
    toggleCart() {
      this.showCart = !this.showCart;
    },
    async checkout() {
      if (!this.validForm || this.cart.length === 0) return;

      const order = {
        name: this.name,
        phone: this.phone,
        lessons: this.cart.map(item => ({
          id: item._id,
          subject: item.subject,
          quantity: item.quantity,
        })),
      };

      try {
        await postOrder(order);
        this.cart = [];
        this.name = '';
        this.phone = '';
        this.orderConfirmed = true;
        setTimeout(() => (this.orderConfirmed = false), 5000);
      } catch (err) {
        alert('Failed to submit order. Check backend.');
        console.error(err);
      }
    },
    async fetchLessons() {
      try {
        this.lessons = await getLessons();
      } catch (err) {
        alert('Failed to load lessons.');
        console.error(err);
      }
    },
    async search() {
      try {
        if (this.searchQuery.trim() === '') {
          await this.fetchLessons();
        } else {
          this.lessons = await searchLessons(this.searchQuery);
        }
      } catch (err) {
        alert('Search failed.');
        console.error(err);
      }
    },
  },
  watch: {
    searchQuery: 'search',
  },
  async mounted() {
    await this.fetchLessons();
  },
}).mount('#app');
