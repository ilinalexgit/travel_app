<?php
namespace ApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity as UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Table(name="app_users")
 * @ORM\Entity(repositoryClass="ApiBundle\Entity\UserRepository")
 * @UniqueEntity("email")
 * @UniqueEntity("username")
 */
class User implements UserInterface, \Serializable
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=25, unique=true)
     * @Assert\NotBlank()
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $password;

    /**
     * @Assert\NotBlank()
     * @Assert\Length(max=4096)
     */
    private $plainPassword;

    /**
     * @ORM\Column(type="string", length=60, unique=true)
     * @Assert\NotBlank()
     * @Assert\Email()
     */
    private $email;

    /**
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;

    /**
     * @ORM\Column(name="roles", type="string", length=256)
     */
    private $roles;

    /**
     * @ORM\OneToMany(targetEntity="Trip", mappedBy="user")
     */
    private $trips;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $passwordRecoveryCode;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $passwordRecoveryCodeExpires;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $accountActivationCode;

    public function __construct()
    {
        $this->isActive = false;
        $this->products = new ArrayCollection();
        // may not be needed, see section on salt below
        // $this->salt = md5(uniqid(null, true));
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getSalt()
    {
        // you *may* need a real salt depending on your encoder
        // see section on salt below
        return null;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function getRoles()
    {
        return unserialize($this->roles);
    }

    public function eraseCredentials()
    {
    }

    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
            // see section on salt below
            // $this->salt,
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->username,
            $this->password,
            // see section on salt below
            // $this->salt
            ) = unserialize($serialized);
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Set password
     *
     * @param string $password
     *
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     *
     * @return User
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean
     */
    public function getIsActive()
    {
        return $this->isActive;
    }


    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    public function setPlainPassword($password)
    {
        $this->plainPassword = $password;
    }

    /**
     * Set roles
     *
     * @param string $roles
     *
     * @return User
     */
    public function setRoles($roles)
    {
        $this->roles = serialize($roles);

        return $this;
    }

    public function getUserAsArray(){
        $arr = array();
        $arr['id'] = $this->getId();
        $arr['username'] = $this->getUsername();
        $arr['email'] = $this->getEmail();
        $arr['roles'] = $this->getRoles();
        return $arr;
    }

    /**
     * Add trip
     *
     * @param \ApiBundle\Entity\Trip $trip
     *
     * @return User
     */
    public function addTrip(\ApiBundle\Entity\Trip $trip)
    {
        $this->trips[] = $trip;

        return $this;
    }

    /**
     * Remove trip
     *
     * @param \ApiBundle\Entity\Trip $trip
     */
    public function removeTrip(\ApiBundle\Entity\Trip $trip)
    {
        $this->trips->removeElement($trip);
    }

    /**
     * Get trips
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTrips()
    {
        return $this->trips;
    }

    /**
     * Set passwordRecoveryCode
     *
     * @param string $passwordRecoveryCode
     *
     * @return User
     */
    public function setPasswordRecoveryCode($passwordRecoveryCode)
    {
        $this->passwordRecoveryCode = $passwordRecoveryCode;

        return $this;
    }

    /**
     * Get passwordRecoveryCode
     *
     * @return string
     */
    public function getPasswordRecoveryCode()
    {
        return $this->passwordRecoveryCode;
    }

    /**
     * Set passwordRecoveryCodeExpires
     *
     * @param \DateTime $passwordRecoveryCodeExpires
     *
     * @return User
     */
    public function setPasswordRecoveryCodeExpires($passwordRecoveryCodeExpires)
    {
        $this->passwordRecoveryCodeExpires = $passwordRecoveryCodeExpires;

        return $this;
    }

    /**
     * Get passwordRecoveryCodeExpires
     *
     * @return \DateTime
     */
    public function getPasswordRecoveryCodeExpires()
    {
        return $this->passwordRecoveryCodeExpires;
    }

    /**
     * Set accountActivationCode
     *
     * @param string $accountActivationCode
     *
     * @return User
     */
    public function setAccountActivationCode($accountActivationCode)
    {
        $this->accountActivationCode = $accountActivationCode;

        return $this;
    }

    /**
     * Get accountActivationCode
     *
     * @return string
     */
    public function getAccountActivationCode()
    {
        return $this->accountActivationCode;
    }
}
