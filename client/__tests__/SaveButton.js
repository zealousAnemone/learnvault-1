/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SaveButton from '../src/components/collections/SaveButton';

configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('SaveButton', () => {
    let wrapper;
    const props = {
      loggedInUser: '5ef3f1798a8800471b987bbe', // userId
      id: '5eee5bac1e986de551d57488', // collectionId
    };

    let consoleOutput = '';
    const mockConsole = jest.fn((output) => {
      consoleOutput += output;
    });
    console.log = mockConsole;
    console.error = mockConsole;

    beforeEach(() => {
      consoleOutput = '';
    });

    afterEach(() => {
      consoleOutput = '';
    });


    beforeAll(() => {
      wrapper = shallow(<SaveButton loggedInUser={props.loggedInUser} id={props.id} />);
    });

    it('Renders a <button> tag with the label "Save Collection"', () => {
      expect(wrapper.type()).toEqual('span');
      expect(wrapper.text()).toMatch('Save Collection');
    });

    it('Invokes the click handler when the Save button is clicked (success path)', (done) => {
      const mockJson = jest.fn(() => Promise.resolve(['5ef2b8c3d5973033a191aea2', '5ef3f1798a8800471b987bbe']));
      const mockFetch = jest.fn(() => Promise.resolve({
        status: 200,
        json: mockJson,
      }));
      global.fetch = mockFetch;

      wrapper.find('.button-like').props().onClick({ key: 'Enter' });

      process.nextTick(() => {
        expect(mockFetch).toHaveBeenCalled();
        expect(mockFetch.mock.calls.length).toBe(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);

        const arg1 = `/api/collections/save/${props.id}`;
        const arg2 = {
          body: JSON.stringify({ id: props.loggedInUser, collectionId: props.id }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        };
        expect(mockFetch).toHaveBeenCalledWith(arg1, arg2);
        expect(mockJson).toHaveBeenCalled();
        expect(mockConsole).toHaveBeenCalled();
        expect(consoleOutput).toMatch('Success');
        done();
      });
    });

    it('Invokes the click handler when the Save button is clicked (error path)', (done) => {
      const mockFetch = jest.fn(() => Promise.reject(new Error('should catch this error')));
      global.fetch = mockFetch;
      wrapper.find('.button-like').props().onClick({ key: 'Enter' });
      process.nextTick(() => {
        expect(mockFetch).toHaveBeenCalled();
        expect(mockFetch.mock.calls.length).toBe(1);

        expect(mockConsole).toHaveBeenCalled();
        expect(consoleOutput).toMatch('Error');
        done();
      });
    });

    it('Invokes the click handler when the Save button is keypressed (error path)', (done) => {
      const mockFetch = jest.fn(() => Promise.reject(new Error('should catch this error')));
      global.fetch = mockFetch;
      wrapper.find('.button-like').props().onKeyPress({ key: 'Enter' });
      process.nextTick(() => {
        expect(mockFetch).toHaveBeenCalled();
        expect(mockFetch.mock.calls.length).toBe(1);
        expect(mockConsole).toHaveBeenCalled();
        expect(consoleOutput).toMatch('Error');
        done();
      });
    });
  });
});
