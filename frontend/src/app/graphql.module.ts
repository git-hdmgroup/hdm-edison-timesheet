import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from '../environments/environment';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './_services/auth/auth.service';

const URI = environment.graphQLurl;
const WS_URI = environment.graphQLwsUrl;

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphQLModule {

  constructor(apollo: Apollo,
              private httpClient: HttpClient,
              private auth: AuthService) {

    const getHeaders = () => {
      const token = this.auth.getToken();
      return {
        Authorization: `Bearer ${token}`,
        'x-hasura-admin-secret': 'admin'
      };
    };

    const httpLink = new HttpLink(httpClient).create({
      uri: URI
    });

    const subscriptionLink = new WebSocketLink({
      uri: WS_URI,
      options: {
        reconnect: true,
        connectionParams: () => {
          return {headers: getHeaders()};
        },
      }
    });

    const link = split(
      ({query}) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      subscriptionLink,
      httpLink
    );

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
