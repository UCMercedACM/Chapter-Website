import React from "react";
import "./Resources.scss";

const Resources = () => {
  return (
    <main>
      <section class="resources__landing">
        <div class="resources__landing__content">
          <h1 class="resources__landing__content__title">RESOURCES</h1>
          <p class="resources__landing__content__text">
            One of our organization's aim is to provide as much resources as we
            can for students to use related to technology, engineering, and free
            students pack.
          </p>
        </div>
      </section>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        class="home__wave"
      >
        <path
          fill="#00e1bfcc"
          fill-opacity="1"
          d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>

      <h1 class="ml-24 mb-4 text-5xl">Resources</h1>

      <div class="flex flex-col">
        <div class="-my-2 py-2 overflow-x-auto sm:px-24 lg:px-8">
          <div class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table class="min-w-full">
              <thead>
                <tr>
                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Course/Field
                  </th>
                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm leading-5 font-medium text-gray-900">
                          Java Programming Basics
                        </div>
                        <div class="text-sm leading-5 text-gray-500">
                          Credits to Geeks for Geeks
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">
                      Java is one of the most popular and widely used
                      programming language...
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    CSE 20
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    <a href="https://www.geeksforgeeks.org/java-programming-basics/">
                      Read More...
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    3/22/2020
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm leading-5 font-medium text-gray-900">
                          Python Beginners Guide
                        </div>
                        <div class="text-sm leading-5 text-gray-500">
                          Credits to Python
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">
                      New to programming? Python is free and easy to learn if
                      you know where to start! This guide will help you to get
                      started quickly....
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    CSE 15
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    <a href="https://wiki.python.org/moin/BeginnersGuide">
                      Read More...
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    4/1/2020
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm leading-5 font-medium text-gray-900">
                          GitHub Learning Lab
                        </div>
                        <div class="text-sm leading-5 text-gray-500">
                          Credits to GitHub
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">
                      With GitHub Learning Lab, grow your skills by completing
                      fun, realistic projects. Get advice and helpful feedback
                      from our friendly Learning Lab bot...
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    Version Control
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    <a href="https://lab.github.com/">Read More...</a>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    4/1/2020
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm leading-5 font-medium text-gray-900">
                          Python Data Science
                        </div>
                        <div class="text-sm leading-5 text-gray-500">
                          Credits to learnpython.org
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">
                      Get started learning Python with DataCamp's free Intro to
                      Python tutorial. Learn Data Science by completing
                      interactive coding challenges and watching videos by
                      expert instructors...
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    CSE 15
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    <a href="https://www.learnpython.org/">Read More...</a>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    4/1/2020
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm leading-5 font-medium text-gray-900">
                          RESTful API Status Codes
                        </div>
                        <div class="text-sm leading-5 text-gray-500">
                          Credits to restfulapi.net
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">
                      REST APIs use the Status-Line part of an HTTP response
                      message to inform clients of their request’s overarching
                      result. RFC 2616 defines the Status-Line syntax as shown
                      below:...
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    CSE 160
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    <a href="https://github.com/UCMercedACM/ACM/wiki/REST-API-Status-Codes">
                      Read More...
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                    3/30/2020
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Resources;
