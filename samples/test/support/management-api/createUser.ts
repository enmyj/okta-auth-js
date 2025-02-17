/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */

/* eslint-disable complexity, max-statements */


import { Client, Group, User } from '@okta/okta-sdk-nodejs';
import { getConfig } from '../../util';
import deleteUser from './deleteUser';
import { UserCredentials } from './createCredentials';

type CreateUserOptions = {
  appId: string;
  credentials: UserCredentials;
  assignToGroups?: string[];
  activate?: boolean;
  customAttribute?: string;
}

const userGroup = 'Basic Auth Web';

export default async ({
  appId,
  credentials,
  assignToGroups = [userGroup], 
  activate = true,
  customAttribute
}: CreateUserOptions): 
  Promise<User> => {
  const config = getConfig();
  const oktaClient = new Client({
    orgUrl: config.orgUrl,
    token: config.oktaAPIKey,
  });

  let user;

  const basicAuthGroup = {
    profile: {
      name: userGroup
    }
  };

  try {
    // Create basic auth group if it doesn't exist
    let {value: testGroup} = await oktaClient.listGroups({
      q: userGroup
    }).next();

    if (!testGroup) {
      testGroup = await oktaClient.createGroup(basicAuthGroup);
    }

    const profile = {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.emailAddress,
      login: credentials.emailAddress
    };
    if (customAttribute) {
      if (customAttribute === 'age') {
        (profile as any).age = Math.floor(Math.random() * 100);
      } else {
        throw new Error(`Unsupported customAttribute: ${customAttribute}`);
      }
    }

    if (activate === false) {
      // Create user without password
      user = await oktaClient.createUser({
        profile
      }, {
        activate: activate
      });
    } else {
      user = await oktaClient.createUser({
        profile,
        credentials: {
          password : { value: credentials.password }
        }
      }, {
        activate: activate
      });
    }

    await oktaClient.assignUserToApplication(appId, {
      id: user.id
    });
    
    for (const groupName of assignToGroups) {
      // TODO: create test group and attach password recovery policy during test run when API supports it
      let {value: testGroup} = await oktaClient.listGroups({
        q: groupName
      }).next();

      if (!testGroup) {
        const group = {
          profile: {
            name: groupName
          }
        };
        testGroup = await oktaClient.createGroup(group);
      }

      await oktaClient.addUserToGroup((testGroup as Group).id, user.id);
    }

    return user;
  } catch (err) {
    if (user) {
      await deleteUser(user);
    }
    throw err;
  }
};
