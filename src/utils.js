import path from 'path';
import bcrypt from 'bcrypt'
import url from 'url';


const __fileName = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__fileName);

export const URL_BASE = 'http://localhost:8080/api'

export const buildResponsePaginated = (data, sort, search, baseUrl = URL_BASE) => {
    return {
      status: "success",
      payload: data.docs.map((doc) => doc.toJSON()),
      totalPages: data.totalPage,
      prevPages: data.prevPage,
      nextPages: data.nextPages,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: 
      data.hasPrevPage
        ? `${baseUrl}/dbproducts?limit=${data.limit}&page=${data.prevPage}${sort !== null ? `&sort=${sort}` : ''}${search !== null ? `&search=${search}` : ''}`
        : null,
      nextLink: data.hasNextPage
        ? `${baseUrl}/dbproducts?limit=${data.limit}&page=${data.nextPage}${sort !== null ? `&sort=${sort}` : ''}${search !== null ? `&search=${search}` : ''}`
        : null,
    };
  };

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);
 

