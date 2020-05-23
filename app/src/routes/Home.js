import React from 'react';
import { gql, graphql } from 'react-apollo';

const Home = ({data}) => <div>
  <pre>{JSON.stringify(data, null, 2)}</pre>
</div>;

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

export default graphql(allUsersQuery)(Home);
