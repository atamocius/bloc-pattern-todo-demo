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

      throw new Error(`${res.status}: ${res.statusText}`);
    } catch (error) {
      console.error('Fetch Error =\n', error);
      return [];
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

      throw new Error(`${res.status}: ${res.statusText}`);
    } catch (error) {
      console.error('Fetch Error =\n', error);
    }
  }

  async markAsComplete(id) {
    try {
      const res = await retryableAsync(() =>
        fetch(`${this._serviceUrl}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        })
      );

      if (res.status === 204) {
        return true;
      }

      throw new Error(`${res.status}: ${res.statusText}`);
    } catch (error) {
      console.error('Fetch Error =\n', error);
      return false;
    }
  }

  async remove(id) {
    try {
      const res = await retryableAsync(() =>
        fetch(`${this._serviceUrl}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        })
      );

      if (res.status === 204) {
        return true;
      }

      throw new Error(`${res.status}: ${res.statusText}`);
    } catch (error) {
      console.error('Fetch Error =\n', error);
      return false;
    }
  }
}
