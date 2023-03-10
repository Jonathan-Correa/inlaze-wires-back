import { Types, isValidObjectId } from 'mongoose';

export const processPopulate = function (
  populate: string | object = { path: '', select: '' }
): object | string {
  if (typeof populate === 'object') return populate;

  if (typeof populate === 'string') {
    try {
      return JSON.parse(populate);
    } catch (error) {
      return populate;
    }
  }

  return populate;
};

export const processField = (field: any) => {
  if (!field) return '';

  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      console.error(e);
      return field;
    }
  }
};

export const processFilter = (filter: any = {}): object | any => {
  if (typeof filter === 'string') {
    try {
      filter = JSON.parse(filter);
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  if (Object.keys(filter).length === 0) return {};

  for (const key in filter) {
    if (!filter.hasOwnProperty(key)) continue;

    if (isValidObjectId(filter[key])) filter[key] = Types.ObjectId(filter[key]);
  }

  return filter;
};

export const processSort = function (sort: any = {}): object {
  if (typeof sort === 'string') {
    try {
      return JSON.parse(sort);
    } catch (e) {
      return {};
    }
  }

  return sort;
};
