import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user {
    user {
      _id
      username
      email
    savedBooks {
      bookId
      authors
      description
      image
      link
      title
    }
      bookCount
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    user {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
      bookCount
    }
  }
`;

// export const QUERY_SAVEDBOOKS = gql`
//   query savedBooks($bookId: String) {
//     savedBooks(bookId: $bookId) {
//       authors
//       description
//       bookId
//       image
//       link
//       title
//     }
//   }
// `;
