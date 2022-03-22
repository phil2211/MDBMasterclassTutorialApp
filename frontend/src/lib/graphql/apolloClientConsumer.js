import { ApolloConsumer } from "@apollo/client";

const apolloClientConsumer = (WrappedComponent) => {
    return (props) => (
      <ApolloConsumer>
        {(client) => {
          return <WrappedComponent client={client} {...props} />
        }}
      </ApolloConsumer>
    )
  }
  
export default apolloClientConsumer;