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


import waitForDisplayed from '../wait/waitForDisplayed';
import buttons from '../selectors/maps/buttons';

export default async(buttonName: string) => {
  const button = (buttons as any)[buttonName];
  if (!button) {
    throw new Error(`No button can match name ${buttonName}`);
  }
  await waitForDisplayed(`button[name="${button}"]`);
};
