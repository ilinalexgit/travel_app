<?php

namespace ApiBundle\Tests\Controller;

use ApiBundle\Tests\WebTestCase;
use Symfony\Component\HttpKernel\Client;

/**
 * AuthenticationControllerTest
 *
 */
class AuthenticationControllerTest extends WebTestCase
{
    /**
     * @var Client
     */
    protected $client;

    /**
     * {@inheritdoc}
     */
    public function setUp()
    {
        $this->client = static::createClient();
    }

    /**
     * test login
     */
    public function testLoginFailure()
    {
        $data = array(
            'username' => 'user',
            'password' => 'userwrongpass',
        );

        $this->client->request('POST', $this->getUrl('api_login_check'), $data);
        $this->assertJsonResponse($this->client->getResponse(), 401);
    }

    /**
     * test login
     */
    public function testCommonBehavior()
    {
        $specialTestParam = $this->client->getKernel()->getContainer()->getParameter('special_test_key');
        $data = array(
            'username' => 'random_test_username',
            'password' => '12345',
            'email' => 'testemail@test.com',
            'test_param' => $specialTestParam
        );

        $start_dt = new \DateTime('now', new \DateTimeZone('UTC'));
        $end_dt = new \DateTime('now', new \DateTimeZone('UTC'));
        $end_dt->add(new \DateInterval('PT30M'));
        $testTripData = array(
            'description' => 'test data',
            'destination' => 'test data',
            'start_dt' => array(
                'date' => $start_dt->format('Y-m-d H:i:s')
            ),
            'end_dt' => array(
                'date' => $end_dt->format('Y-m-d H:i:s')
            )
        );

        //sign up
        $this->client->request('POST', $this->getUrl('user_registration'), $data);
        $this->assertJsonResponse($this->client->getResponse(), 200);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue(isset($response['success']));
        $this->assertTrue($response['success']);


        //try to log in
        $this->client->request('POST', $this->getUrl('api_login_check'), $data);
        $this->assertJsonResponse($this->client->getResponse(), 200);

        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $response);
        $this->assertArrayHasKey('user', $response);

        $token = $response['token'];
        $user_id = $response['user']['id'];


        //create trip
        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('%s %s', $this->authorizationHeaderPrefix, $token));
        $client->request('POST', $this->getUrl('trip_add'), $testTripData);
        $this->assertJsonResponse($client->getResponse(), 200);
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('success', $response);
        $this->assertArrayHasKey('trip_id', $response);
        $this->assertTrue($response['success']);

        $trip_id = $response['trip_id'];

        //get trip
        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('%s %s', $this->authorizationHeaderPrefix, $token));
        $client->request('GET', $this->getUrl('trip_show', array('id' => $trip_id)));
        $this->assertJsonResponse($client->getResponse(), 200);
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('description', $response);
        $this->assertArrayHasKey('destination', $response);
        $this->assertArrayHasKey('start_dt', $response);
        $this->assertArrayHasKey('end_dt', $response);

        //delete trip
        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('%s %s', $this->authorizationHeaderPrefix, $token));
        $client->request('DELETE', $this->getUrl('trip_delete', array('id' => $trip_id)));
        $this->assertJsonResponse($client->getResponse(), 200);
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertTrue($response['success']);

        //try to get deleted trip
        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('%s %s', $this->authorizationHeaderPrefix, $token));
        $client->request('GET', $this->getUrl('trip_show', array('id' => $trip_id)));
        $this->assertJsonResponse($client->getResponse(), 400);
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('success', $response);
        $this->assertArrayHasKey('errors', $response);
        $this->assertFalse($response['success']);

        //delete user
        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('%s %s', $this->authorizationHeaderPrefix, $token));
        $client->request('DELETE', $this->getUrl('user_delete', array('id' => $user_id)));
        $this->assertJsonResponse($client->getResponse(), 200);
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('success', $response);
        $this->assertTrue($response['success']);
    }
}
