/*
 * Copyright 2016 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(['models/agents/environments'], function (Environments) {
  describe('Environments Model', function () {

    beforeAll(function () {
      jasmine.Ajax.install();
      jasmine.Ajax.stubRequest(/\/api\/admin\/internal\/environments/).andReturn({
        "responseText": JSON.stringify(["QA", "Dev", "Test"]),
        "status":       200
      });
    });

    afterAll(function () {
      jasmine.Ajax.uninstall();
    });

    it("should initialize the environments in sorted order", function () {
      Environments.init();
      expect(Environments.list.length).toBe(3);
      expect(Environments.list[0].name()).toBe('Dev');
      expect(Environments.list[1].name()).toBe('QA');
      expect(Environments.list[2].name()).toBe('Test');
    });

    it("should initialize the environments with state depending upon the checkedAgents", function () {
      var checkedAgents = [{
        environments: function () {
          return ['Test', 'QA'];
        }
      }, {
        environments: function () {
          return ['Test', 'Dev', 'QA'];
        }
      }];
      Environments.init(checkedAgents);
      expect(Environments.list.length).toBe(3);
      expect(Environments.list[0].name()).toBe('Dev');
      expect(Environments.list[1].name()).toBe('QA');
      expect(Environments.list[2].name()).toBe('Test');

      expect(Environments.list[0].isChecked()).toBe(false);
      expect(Environments.list[0].isIndeterminate()).toBe(true);
      expect(Environments.list[1].isChecked()).toBe(true);
      expect(Environments.list[1].isIndeterminate()).toBe(false);
      expect(Environments.list[2].isChecked()).toBe(true);
      expect(Environments.list[2].isIndeterminate()).toBe(false);
    });
  });
});
