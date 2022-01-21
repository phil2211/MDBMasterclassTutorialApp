import { ApolloConsumer } from "@apollo/client";

const clientProvider = WrappedComponent => {
    return props => (
      <ApolloConsumer>
        {client => {
          return <WrappedComponent client={client} {...props} />
        }}
      </ApolloConsumer>
    )
  }
  
export default clientProvider;