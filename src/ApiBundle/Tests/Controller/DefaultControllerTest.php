<?php

namespace ApiBundle\Tests\Controller;

use ApiBundle\Tests\WebTestCase;

/**
 * PageControllerTest
 *
 * @author Nicolas Cabot <n.cabot@lexik.fr>
 */
class PageControllerTest extends WebTestCase
{
    /**
     * @param array $user
     *
     * @dataProvider getUsers
     */
    public function testGetPages($user)
    {
        $client = $this->createAuthenticatedClient($user);
        $client->request('GET', $this->getUrl('api/trips'));

        $response = $client->getResponse();
        $this->assertJsonResponse($response, 200);

        $content = json_decode($response->getContent(), true);
        $this->assertInternalType('array', $content);
        $this->assertCount(10, $content);

        $page = $content[0];
        $this->assertArrayHasKey('title', $page);
        $this->assertArrayHasKey('published_at', $page);
        $this->assertArrayNotHasKey('content', $page);
    }
}
