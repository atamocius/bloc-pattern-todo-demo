import { retryableAsync } from '../utils/observableUtils';

export default class TodoService {
  constructor(serviceUrl) {
    this._serviceUrl = serviceUrl;
  }

  async getAll() {
    try {
      const res = await retryableAsync(() => fetch(this._serviceUrl));

      if (res.status === 200) {
        return await res.json();
      }

      return Promise.reject(`${res.status}: ${res.statusText}`);
    } catch (error) {
      return Promise.reject(`Fetch Error: ${error}`);
    }
  }

  async add(item) {
    try {
      const res = await retryableAsync(() =>
        fetch(this._serviceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(item),
        })
      );

      if (res.status === 201) {
        return await res.json();
      }

      return Promise.reject(`${res.status}: ${res.statusText}`);
    } catch (error) {
      return Promise.reject(`Fetch Error: ${error}`);
    }
  }

  async update(id, item) {
    try {
      const res = await retryableAsync(() =>
        fetch(`${this._serviceUrl}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(item),
        })
      );

      if (res.status === 204) {
        return Promise.resolve();
      }

      return Promise.reject(`${res.status}: ${res.statusText}`);
    } catch (error) {
      return Promise.reject(`Fetch Error: ${error}`);
    }
  }

  async updateCompleted(id, completed) {
    try {
      const res = await retryableAsync(() =>
        fetch(`${this._serviceUrl}/${id}/${completed}`, {
          method: 'PATCH',
        })
      );

      if (res.status === 204) {
        return Promise.resolve();
      }

      return Promise.reject(`${res.status}: ${res.statusText}`);
    } catch (error) {
      return Promise.reject(`Fetch Error: ${error}`);
    }
  }

  async remove(id) {
    try {
      const res = await retryableAsync(() =>
        fetch(`${this._serviceUrl}/${id}`, {
          method: 'DELETE',
        })
      );

      if (res.status === 204) {
        return Promise.resolve();
      }

      return Promise.reject(`${res.status}: ${res.statusText}`);
    } catch (error) {
      return Promise.reject(`Fetch Error: ${error}`);
    }
  }
}
